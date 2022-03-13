import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map, Observable } from 'rxjs';
import { Task, Item } from './schema/task.schema';
import { TaskRepository } from './task.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import camelCase from 'camelcase';
import { GetAllTasksRequest } from './types/tasks';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly API_URL: string;
  private readonly API_KEY: string;

  constructor(
    private readonly _tookanTaskRespository: TaskRepository,
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
  ) {
    this.API_URL = this._configService.get<string>('TOOKAN_API_URL');
    this.API_KEY = this._configService.get<string>('TOOKAN_API_KEY');
  }

  async onModuleInit() {
    try {
      const { results, count } = await this._tookanTaskRespository.findAll({}, 0, 3);

      let getAllTasksRequestBody = undefined; 
      if(count > 0) {
        getAllTasksRequestBody = {
          api_key: this.API_KEY,
          job_type: 1,
          custom_fields: 1,
          is_pagination: 1,
          requested_page: 1,
          start_date: results[0].startedDatetime.split('T')[0]
        };
      }

      await this.loadTasksFromAPI(getAllTasksRequestBody);
    } catch (e) {
      console.log(e);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    await this.checkForNewOrUpdatedTasksForToday();
  }



  /**
   * Get all the restaurants that exists in tookan
   * @returns Promise<Restaurant>
   */
  getRestaurants() {
    const pipelines = [
      { $group: { _id: '$restaurantName' } },
      { $project: { restaurantName: '$_id' } },
    ]
    return this._tookanTaskRespository.aggregate(pipelines);
  }

  /**
   * Gets all tasks up to today and inserts them into the application database
   */
  async loadTasksFromAPI(getAllTasksRequestBody?: GetAllTasksRequest) {
    if (!getAllTasksRequestBody) {
      getAllTasksRequestBody = {
        api_key: this.API_KEY,
        job_type: 1,
        custom_fields: 1,
        is_pagination: 1,
        requested_page: 1,
      };
    }

    let totalPageCount = 0;
    let shouldCountinue = false;
    const tasks = [];
    
    console.time('fetch from tookan and process: ')
    do {
      const { data, total_page_count } = await lastValueFrom(
        this._httpService
          .post(`${this.API_URL}get_all_tasks`, getAllTasksRequestBody)
          .pipe(map((response) => response.data)),
      );

      data.map((el) => tasks.push(this._mapAPITaskToEntity(el)));

      totalPageCount = total_page_count;
      getAllTasksRequestBody.requested_page += 1;
      
      shouldCountinue =
      getAllTasksRequestBody.requested_page < total_page_count &&
      getAllTasksRequestBody.is_pagination == 1;
    } while (shouldCountinue);
    console.timeEnd('fetch from tookan and process: ');
    console.log("data size: ", tasks.length)
    console.time('insert');
    await this._tookanTaskRespository.createMany(tasks);
    console.timeEnd('insert');
  }

  /**
   * fetches tasks recorded today from the tookan api and updates the application database
   * @returns
   */
  checkForNewOrUpdatedTasksForToday(): Promise<any> {
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    const getAllTasksRequestBody: GetAllTasksRequest = {
      api_key: this.API_KEY,
      job_type: 1,
      custom_fields: 1,
      is_pagination: 1,
      requested_page: 1,
      start_date: today,
    };

    return this.loadTasksFromAPI(getAllTasksRequestBody);
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
    let task: Task = {};

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

    task.dateCreated = task.creationDatetime?.split(' ')[0];

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
                  ].some((k) => k == camelCasedKey)
                  
                  let value  = el.val;
                  if(exist) {
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
            const camelCasedKey = camelCase(key);
            task[camelCasedKey] = value;
        }
      });
    }

    return task;
  }
}
