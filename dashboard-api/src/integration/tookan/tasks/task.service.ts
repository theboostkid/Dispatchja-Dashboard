import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map, Observable } from 'rxjs';
import { Task, Item } from './schema/task.schema';
import { TaskRepository } from './task.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import camelCase from 'camelcase';
import { GetAllTasksRequest } from './types/tasks';
import { MerchantService } from 'src/merchant/merchant.service';
import { GroupByOptions } from './types/groupbyOptions';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as csv from 'csv-parser';
import { SearchQueryParams } from './dto/task.dto';
@Injectable()
export class TaskService implements OnModuleInit {
  private readonly API_URL: string;
  private readonly API_KEY: string;
  constructor(
    private readonly _tookanTaskRepository: TaskRepository,
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
    private readonly _merchantService: MerchantService,
  ) {
    this.API_URL = this._configService.get<string>('TOOKAN_API_URL');
    this.API_KEY = this._configService.get<string>('TOOKAN_API_KEY');
  }

  async onModuleInit() {
    try {
      this.populateDBFromTookan();
    } catch (e) {
      console.log(e);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    try {
      console.info('[info] running cronjob: ', new Date());
      await this.populateDBFromTookan();
      console.info('[info] finish running cronjob: ', new Date());
    } catch (e) {
      console.error('[error] running cronjob: ', e);
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async uploadCleanUpCron() {
    const directory = process.cwd() + '/uploads/';
    const files = await fsp.readdir(directory);
    if (files.length > 0) {
      await Promise.all(files.map((e) => fsp.unlink(`${directory}${e}`)));
    }
  }

  /**
   * Populate database with tasks coming from tookan api
   */
  async populateDBFromTookan() {
    const result = await this._merchantService.findAll();
    if (result.count == 0) return 0;

    const { results, count } = await this._tookanTaskRepository.findAll(
      {},
      0,
      3,
    );
    let getAllTasksRequestBody = undefined;
    if (count > 0) {
      getAllTasksRequestBody = {
        api_key: this.API_KEY,
        job_type: 1,
        custom_fields: 1,
        is_pagination: 1,
        requested_page: 1,
        start_date: results[0].startedDatetime.split('T')[0],
      };
    }

    await this.fetchTasksFromTookanAPI(getAllTasksRequestBody);
  }

  /**
   * Gets all tasks up to today and inserts them into the application database
   */
  async fetchTasksFromTookanAPI(getAllTasksRequestBody?: GetAllTasksRequest) {
    const { results } = await this._merchantService.findAll();
    const merchants = results;

    if (!getAllTasksRequestBody) {
      getAllTasksRequestBody = {
        api_key: this.API_KEY,
        job_type: 1,
        custom_fields: 1,
        is_pagination: 1,
        requested_page: 1,
      };
    }

    let shouldCountinue = false;
    const tasks = [];

    console.time('[info] fetch from tookan and process: ');
    do {
      const { data, total_page_count } = await lastValueFrom(
        this._httpService
          .post(`${this.API_URL}get_all_tasks`, getAllTasksRequestBody)
          .pipe(map((response) => response.data)),
      );

      data.forEach((el) => {
        const task = this._mapAPITaskToEntity(el);
        if (!task.merchantId) return;

        const merchant =
          merchants?.find((el) => el.merchantId === task.merchantId) || false;
        if (!merchant) return;

        task.merchantName = merchant.name;
        tasks.push(task);
      });

      getAllTasksRequestBody.requested_page += 1;

      shouldCountinue =
        getAllTasksRequestBody.requested_page < total_page_count &&
        getAllTasksRequestBody.is_pagination == 1;
    } while (shouldCountinue);
    console.timeEnd('[info] fetch from tookan and process: ');

    const len = tasks.length;
    if (len) {
      console.time(`[info] creating ${tasks.length} tasks from tookan: `);

      await this._tookanTaskRepository.createMany(tasks);

      console.timeEnd(`[info] creating ${tasks.length} tasks from tookan: `);
    }
  }

  updateTask(jobId: string, data): Observable<any> {
    return this._httpService.post(`${this.API_URL}edit_tasks`, {
      api_key: this.API_KEY,
      job_id: jobId,
      custom_field_template: 'Order_Details',
      meta_data: [
        {
          label: 'Client_Name',
          data: 'travis taylor',
        },
      ],
    });
  }

  /**
   * Maps tookan task properties to Task object properties
   * @param taskComingFromAPI
   * @returns Task object
   */
  _mapAPITaskToEntity(taskComingFromAPI: any): Task {
    const task: Task = {};

    const ignoreKeyLists = [
      'fields',
      'extras',
      'ref_images',
      'req_popup',
      'geofence_reference_id',
    ];

    for (const key in taskComingFromAPI) {
      if (ignoreKeyLists.some((el) => el === key)) {
        continue;
      }

      const camelCasedKey = camelCase(key);
      task[`${camelCasedKey}`] = taskComingFromAPI[key];
    }

    task.dateCreated = new Date(task.creationDatetime?.split(' ')[0]);

    const customFields = taskComingFromAPI.fields?.custom_field;

    if (customFields && customFields.length > 0) {
      let items: Item[] = [];

      customFields.forEach((el) => {
        const key = el.label;
        const value = el.data;

        switch (key) {
          case 'Payment':
            task['paymentMethod'] = value;
            break;
          case 'Phone_No':
            task['clientPhone'] = value;
            break;
          case 'Delivery_Fee':
            task['deliveryFee'] = Number(value?.replace('-', '0') || 0);
            break;
          case 'Items':
            items =
              value?.body?.map((el) => {
                const item = {};
                el.forEach((el) => {
                  const camelCasedKey = camelCase(el.head);
                  const exist = [
                    'price',
                    'quantity',
                    'taxRate',
                    'taxValue',
                    'itemDiscount',
                    'totalItemPrice',
                  ].some((k) => k == camelCasedKey);

                  let value = el.val;
                  if (exist) {
                    value = Number(el.val) || 0;
                  }

                  item[camelCasedKey] = value;
                });

                item['paymentMethod'] = task['paymentMethod'];
                return item;
              }) || [];

            task['items'] = items;
            break;
          default:
            const camelCasedKey = camelCase(key).replace(
              /restaurant/gi,
              'merchant',
            );
            task[camelCasedKey] = value;
        }
      });
    }

    return task;
  }

  /**
   * Convert a string value to number by removing $-,%^#&* special characters
   * @param value the string value to convert to number
   * @returns the numerical value
   */
  convertToNumber(value: string) {
    return Number(value?.replace(/[#$%-^&*,]/g, '0'));
  }

  /**
   * Maps tookan task properties coming from csv to Task object properties
   * @param taskComingFromAPI
   * @returns Task object
   */
  _mapCSVTaskToEntity(
    taskComingFromCSV: any,
    tasks: Array<Task>,
  ): { exist: boolean; task: Task } {
    let foundIndex = -1;
    let task: Task = tasks.find((el, i) => {
      foundIndex = i;
      return el.orderId?.trim() == taskComingFromCSV['task_id']?.trim();
    });

    let exist = true;
    if (!task) {
      exist = false;
      task = {};
      for (const key in taskComingFromCSV) {
        const camelCasedKey = camelCase(key).replace(
          /restaurant/gi,
          'merchant',
        );
        const value = taskComingFromCSV[key];

        switch (camelCasedKey) {
          case 'taskId':
            task['jobId'] = value;
            break;
          case 'payment':
            task['paymentMethod'] = value;
            break;
          case 'phoneNo':
            task['clientPhone'] = value;
            break;
          case 'deliveryFee':
            task['deliveryFee'] = this.convertToNumber(value);
            break;
          case 'totalPrice':
            task['totalPrice'] = this.convertToNumber(value);
            break;
          default:
            task[camelCasedKey] = value;
        }
      }
      task.items = [];
    }

    task.items.push({
      name: task['itemsName'],
      quantity: this.convertToNumber(task['itemsQuantity']),
      price: this.convertToNumber(task['itemsPrice']),
      taxRate: this.convertToNumber(task['itemsTaxRate']),
      taxValue: this.convertToNumber(task['itemsTaxValue']),
      itemDiscount: this.convertToNumber(task['itemsItemDiscount']),
      totalItemPrice: this.convertToNumber(task['itemsTotalItemPrice']),
    });

    task.dateCreated = new Date(task.completeBefore?.split(' ')[0]);

    if (exist) {
      tasks.splice(foundIndex, 1, task);
    }

    return { exist, task };
  }

  async getStatistic(
    period?: string,
    merchantName?: string,
    startDate?: string,
    endDate?: string,
    jobStatus?: number,
  ) {
    const groupByOptions: GroupByOptions = {
      merchantName,
      startDate,
      endDate,
    };

    const periodData = await this.getTotalBreakDownGroupedByField({
      ...groupByOptions,
      propertyToGroupBy: 'merchantName',
      returnItems: false,
      jobStatus,
    });
    const periodSummary = await this.getTotalPriceForEachPeriod(
      period || 'monthly',
      startDate,
      merchantName,
      jobStatus,
    );

    let paymentMethodSummary;
    if (!merchantName) {
      paymentMethodSummary = await this.getTotalBreakDownGroupedByField({
        ...groupByOptions,
        propertyToGroupBy: 'paymentMethod',
        returnItems: false,
        jobStatus,
      });
      paymentMethodSummary.forEach((el) => {
        delete el.totalCashTransactions;
        delete el.totalCardTransactions;
      });
    }

    return {
      periodSummary,
      paymentMethodSummary: merchantName ? undefined : paymentMethodSummary,
      merchantSummary: merchantName ? periodData[0] : periodData,
    };
  }

  /**
   * Calculates and return a summation for all or a specific merchant group by a specific period.
   * @param period weekly or monthly
   * @param startDate the start date that the method should aggreate from
   * @param merchantName the merchant name
   * @param jobStatus the status of the tasks
   * @returns
   */
  async getTotalPriceForEachPeriod(
    period: string,
    startDate?: string,
    merchantName?: string,
    jobStatus?: number,
  ) {
    const pipelines = [];

    if (merchantName) {
      pipelines.push({
        $match: { merchantName: merchantName, jobStatus: jobStatus || 2 },
      });
    }

    if (startDate) {
      const year = startDate.split('-')[0];

      pipelines.push({
        $match: {
          dateCreated: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      });
    }

    pipelines.push({
      $group: {
        _id:
          period == 'monthly'
            ? { $substr: ['$dateCreated', 0, 7] }
            : { $week: '$dateCreated' },
        // _id: { $substr: ['$creationDatetime', 0, 7] },
        totalJobs: {
          $sum: 1,
        },
        date: { $first: '$dateCreated' },
        totalPrice: {
          $sum: '$totalPrice',
        },
        items: {
          $push: '$items',
        },
      },
    });

    const projections = {
      $project: {
        month: '$_id',
        totalJobs: 1,
        totalPrice: 1,
        date: 1,
        items: {
          $reduce: {
            input: '$items',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        },
      },
    };
    console.log(period);
    if (period == 'weekly') {
      delete projections.$project['month'];
      projections.$project['week'] = '$_id';
    }

    pipelines.push(projections);

    const data = await this._tookanTaskRepository.aggregate(pipelines);

    return this._getMappedTotals(data);
  }

  getTaskById(id: string) {
    return this._tookanTaskRepository.findOne({ id });
  }

  async getTasks({
    merchantName,
    startDate,
    endDate,
    jobStatus,
    orderId,
    fleetId,
  }: SearchQueryParams) {
    const pipelines = [];

    if (merchantName) {
      pipelines.push({
        $match: { merchantName: merchantName, jobStatus: jobStatus || 2 },
      });
    } else {
      pipelines.push({
        $match: { jobStatus: jobStatus || 2 },
      });
    }

    if (orderId) {
      pipelines.push({
        $match: { orderId },
      });
    }

    if (fleetId) {
      pipelines.push({
        $match: { fleetId },
      });
    }

    if (startDate) {
      const dateFilterPipeline = {
        dateCreated: { $gte: new Date(startDate) },
      };

      if (endDate) {
        dateFilterPipeline['dateCreated']['$lte'] = new Date(endDate);
      }

      pipelines.push({ $match: dateFilterPipeline });
    }

    const data = await this._tookanTaskRepository.aggregate(pipelines);

    return this._getMappedTotals(data, true, true);
  }

  _summarizeItems(items) {
    const isDelivery = (name) => name === 'DELIVERY_FEE';
    const isCash = (paymentMethod) => paymentMethod === 'CASH';

    const summary = items.reduce(
      (cur, prev) => {
        const isDeliveryFee = isDelivery(prev.name);
        const isCashTransaction = isCash(prev.paymentMethod);

        const summary = {
          totalCashTransactions: isCashTransaction
            ? cur.totalCashTransactions +
              prev.totalItemPrice -
              prev.itemDiscount
            : cur.totalCashTransactions,
          totalCardTransactions: !isCashTransaction
            ? cur.totalCardTransactions +
              prev.totalItemPrice -
              prev.itemDiscount
            : cur.totalCardTransactions,
          itemDiscount: cur.itemDiscount + prev.itemDiscount,
          totalDeliveryFee: isDeliveryFee
            ? cur.totalDeliveryFee + prev.totalItemPrice
            : cur.totalDeliveryFee,
          totalWithoutDeliveryFee: !isDeliveryFee
            ? cur.totalWithoutDeliveryFee + prev.totalItemPrice
            : cur.totalWithoutDeliveryFee,
          taxRate: Number(cur.taxRate) + prev.taxRate,
          taxValue: Number(cur.taxValue) + prev.taxValue,
        };

        return summary;
      },
      {
        totalCashTransactions: 0,
        totalCardTransactions: 0,
        totalWithoutDeliveryFee: 0,
        totalDeliveryFee: 0,
        itemDiscount: 0,
        taxValue: 0,
        taxRate: 0,
      },
    );
    return summary;
  }

  private _getMappedTotals(
    data: any[],
    returnItems?: boolean,
    includeOtherProperties?: boolean,
  ) {
    return data.map((el) => {
      const {
        month,
        week,
        date,
        merchantName,
        paymentMethod,
        totalJobs,
        totalPrice,
        items,
      } = el;
      const summary = this._summarizeItems(items);
      let results = {
        month,
        week,
        date,
        merchantName,
        paymentMethod,
        totalJobs,
        totalPriceWithDiscount: totalPrice,
        totalWithoutDeliveryFeeAndDiscount:
          summary.totalWithoutDeliveryFee - summary.itemDiscount,
        totalDeliveryFee: summary.totalDeliveryFee,
        totalTaxRate: summary.taxRate,
        totalTaxValue: summary.taxValue,
        totalDiscount: summary.itemDiscount,
        totalCashTransactions: summary.totalCashTransactions,
        totalCardTransactions: summary.totalCardTransactions,
        items: returnItems ? items : undefined,
      };

      delete el.items;
      delete el.totalPrice;

      if (includeOtherProperties) {
        results = { ...results, ...el };
      }

      results['totalOwedToMerchant'] =
        results.totalPriceWithDiscount - results.totalCardTransactions * 0.04;
      return results;
    });
  }

  private async getTotalBreakDownGroupedByField({
    propertyToGroupBy,
    merchantName,
    startDate,
    endDate,
    returnItems,
    jobStatus,
  }: GroupByOptions) {
    const pipelines = [];

    if (merchantName) {
      pipelines.push({
        $match: { merchantName: merchantName, jobStatus: jobStatus || 2 },
      });
    } else {
      pipelines.push({
        $match: { jobStatus: jobStatus || 2 },
      });
    }

    if (startDate) {
      const dateFilterPipeline = {
        dateCreated: { $gte: new Date(startDate) },
      };

      if (endDate) {
        dateFilterPipeline['dateCreated']['$lte'] = new Date(endDate);
      }

      pipelines.push({ $match: dateFilterPipeline });
    }

    pipelines.push({
      $group: {
        _id: `$${propertyToGroupBy}`,
        totalJobs: {
          $sum: 1,
        },
        totalPrice: {
          $sum: '$totalPrice',
        },
        items: {
          $push: '$items',
        },
      },
    });

    const projection = {
      $project: {
        totalJobs: 1,
        totalPrice: 1,
        items: {
          $reduce: {
            input: '$items',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        },
      },
    };
    projection['$project'][`${propertyToGroupBy}`] = '$_id';
    pipelines.push(projection);

    const data = await this._tookanTaskRepository.aggregate(pipelines);

    return this._getMappedTotals(data, returnItems);
  }

  /**
   * Processes and Insert transactions from a csv file
   * @param file the uploaded csv file
   * @param userId the user who has upload the transaction file
   * @returns
   */
  async processFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(['Batch upload file is missing.']);
    }

    const merchantMap = {};
    (await this._merchantService.findAll()).results.forEach((el) => {
      merchantMap[el.merchantId.toLowerCase().trim()] = el.name;
    });

    return new Promise((resolve) => {
      const tasks: Array<Task> = [];
      fs.createReadStream(file.path, 'utf-8')
        .pipe(
          csv({
            mapHeaders: ({ header }) => (header || '').toLowerCase().trim(),
          }),
        )
        .on('data', async (data) => {
          const { exist, task } = this._mapCSVTaskToEntity(data, tasks);
          if (!task.merchantId) return;

          const merchantName = merchantMap[task.merchantId];
          if (!merchantName) return;

          task.merchantName = merchantName;
          if (!exist) {
            tasks.push({
              jobId: task.jobId,
              merchantId: task.merchantId,
              merchantName: task.merchantName,
              paymentMethod: task.paymentMethod,
              totalPrice: task.totalPrice,
            });
          }
        })
        .on('end', async () => {
          try {
            await this._tookanTaskRepository.createMany(tasks);
          } catch (error) {
            console.log(error);
          }
          resolve(null);
        });
    });
  }
}
