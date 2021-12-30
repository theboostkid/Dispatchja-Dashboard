import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Task, Item } from './schema/task.schema';
import { TookanTaskRepository } from './tookantask.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import camelCase from "camelcase";
import { start } from 'repl';


@Injectable()
export class TookanService implements OnModuleInit {
	private readonly API_URL: string;
	private readonly API_KEY: string;

	constructor(
		private readonly _tookanTaskRespository: TookanTaskRepository,
		private readonly _configService: ConfigService,
		private readonly _httpService: HttpService) {
		this.API_URL = this._configService.get<string>("TOOKAN_API_URL");
		this.API_KEY = this._configService.get<string>("TOOKAN_API_KEY");
	}

	async onModuleInit() {
		await this.loadTasksFromAPI();
	}

	@Cron(CronExpression.EVERY_30_MINUTES)
	async handleCron() {
		console.log('Called when the current second is 45');
		await this.checkForNewOrUpdatedTasksForToday();
	}

	/**
	 * Get all the restaurants that exists in tookan
	 * @returns Promise<Restaurants>
	 */
	getRestaurants() {
		const pipelines = [
			{ $group: { _id: "$restaurantName" } },
			{ $project: { restaurantName: "$_id" } }
		];
		return this._tookanTaskRespository.aggregate(pipelines);
	}

	async loadTasksFromAPI() {
		const apiRequestBody = {
			"api_key": this.API_KEY,
			"job_type": 1,
			"custom_fields": 1,
			"is_pagination": false
		}

		const { data } = await lastValueFrom(this._httpService.post(`${this.API_URL}get_all_tasks`,
			apiRequestBody).pipe(map(response => response.data)))

		const apiResults = data.map((el) => this._mapAPITaskToEntity(el));

		if (apiResults.length > 0) {
			await this._tookanTaskRespository.createMany(apiResults)
		}
	}

	async checkForNewOrUpdatedTasksForToday(jobStatus?: number, jobType?: number): Promise<any> {
		const today = new Date();
		const isoFormat = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

		const apiRequestFilter = {
			"api_key": this.API_KEY,
			"job_status": jobStatus,
			"job_type": jobType || 1,
			"custom_fields": 1,
			"is_pagination": false,
			"start_date": isoFormat,
		}

		const { data } = await lastValueFrom(this._httpService.post(`${this.API_URL}get_all_tasks`,
			apiRequestFilter).pipe(map(response => response.data)))

		const apiResults = data.map((el) => this._mapAPITaskToEntity(el));

		if (apiResults.length > 0) {
			await this._tookanTaskRespository.createMany(apiResults)
		}

		return apiResults;
	}

	getTaskForRestaurantForPeriod(restaurantName?: string, startDate?: string, endDate?: string) {
		let pipelines = [];

		if (restaurantName) {
			pipelines.push({
				$match: { "restaurantName": restaurantName }
			})
		}
		console.log(startDate)
		if (startDate) {
			let dateFilterPipeline = {
				dateCreated: { $gte: startDate }
			};

			if (endDate) {
				dateFilterPipeline["dateCreated"]["$lte"] = endDate;
			}

			pipelines.push({ $match: dateFilterPipeline });
		}

		pipelines.push({
			$group: {
				_id: "$restaurantName",
				total: {
					$sum: 1
				},
				totalBill: {
					$sum: "$totalPrice"
				},
				items: {
					$push: "$items"
				}
			}
		})

		pipelines.push({
			$project: {
				restaurantName: "$_id",
				total: 1,
				totalBill: 1,
				"items": {
					$reduce: {
						input: '$items',
						initialValue: [],
						in: { $concatArrays: ['$$value', '$$this'] }
					}
				}
			}
		})

		return this._tookanTaskRespository.aggregate(pipelines)
	}

	// getTasks(taskFilters: TaskFilterDto): Observable<any> {
	// 	return this._httpService.post(`${this.API_URL}get_all_tasks`,
	// 		{
	// 			"api_key": this.API_KEY,
	// 			"job_status": taskFilters.jobStatus,
	// 			"job_type": taskFilters.jobType,
	// 			"start_date": taskFilters.startDate,
	// 			"end_date": taskFilters.endDate,
	// 			"custom_fields": taskFilters.customFields,
	// 			"is_pagination": taskFilters.isPagination,
	// 			"requested_page": taskFilters.requestedPage,
	// 			"customer_id": taskFilters.customerId,
	// 			"fleet_id": taskFilters.fleetId,
	// 			"job_id": taskFilters.jobId,
	// 			"order_id": taskFilters.orderId,
	// 			"team_id": taskFilters.teamId
	// 		})
	// }

	// updateTask(taskId: string, updateTaskDto: UpdateTaskDto): Observable<any> {
	// 	return this._httpService.post(`${this.API_URL}get_all_tasks`,
	// 		{
	// 			"api_key": this.API_KEY,
	// 			"job_id": taskId,
	// 			"pickup_custom_field_template": "Template_1",
	// 			"pickup_meta_data": updateTaskDto.pickupMetaData
	// 		})
	// }

	/**
	 * Maps tookan task properties to Task object properties
	 * @param taskComingFromAPI 
	 * @returns Task object 
	 */
	_mapAPITaskToEntity(taskComingFromAPI: any): Task {
		let task: Task = {};

		const ignoreKeyLists = ["fields", "extras", "ref_images", "req_popup", "geofence_reference_id"];

		for (const key in taskComingFromAPI) {
			if (ignoreKeyLists.some((el) => el === key)) {
				continue;
			}

			const camelCasedKey = camelCase(key);
			task[`${camelCasedKey}`] = taskComingFromAPI[key]
		}

		task.dateCreated = task.creationDatetime?.split(' ')[0];

		const customFields = taskComingFromAPI.fields?.custom_field;

		if (customFields && customFields.length > 0) {
			let items: Item[] = [];

			customFields.forEach((el) => {
				const key = el.label;
				const value = el.data;

				switch (key) {
					case "Payment":
						task["paymentMethod"] = value;
						break;
					case "Phone_No":
						task["clientPhone"] = value;
						break;
					case "Items":
						items = value?.body?.map((el) => {
							const item = {};
							el.forEach(el => {
								const camelCasedKey = camelCase(el.head);
								const value = [
									"price",
									"quantity",
									"taxRate",
									"taxValue",
									"itemDiscount",
									"totalItemPrice"
								]
									.some(k => k == camelCasedKey) ? Number(el.val?.replace("-", "0") || "0") : el.val

								item[camelCasedKey] = value;
							})
							return item;
						}) || [];

						task["items"] = items;
						break;
					default:
						const camelCasedKey = camelCase(key);
						task[camelCasedKey] = value;

				}
			})
		}

		return task
	}


}
