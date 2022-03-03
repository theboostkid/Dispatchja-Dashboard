import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map, Observable } from 'rxjs';
import { Task, Item } from './schema/task.schema';
import { TaskRepository } from './task.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import camelCase from "camelcase";


@Injectable()
export class TaskService implements OnModuleInit {
	private readonly API_URL: string;
	private readonly API_KEY: string;

	constructor(
		private readonly _tookanTaskRespository: TaskRepository,
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
			"is_pagination": 0
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

	updateTask(jobId: string): Observable<any> {
		return this._httpService.post(`${this.API_URL}edit_tasks`,
			{
				"api_key": this.API_KEY,
				"job_id": jobId,
				"custom_field_template": "Order_Details",
				"meta_data": [
					{
						"label": "Client_Name",
						"data": "travis taylor"
					}
				]
			})
	}

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
					case "Payment":
						task["paymentMethod"] = value;
						break;
					case "Phone_No":
						task["clientPhone"] = value;
						break;
					case "Delivery_Fee":
						task["deliveryFee"] = Number(value?.replace("-", "0") || 0);
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

							//todo: review potential undefined
							item["paymentMethod"] = task["paymentMethod"];
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
