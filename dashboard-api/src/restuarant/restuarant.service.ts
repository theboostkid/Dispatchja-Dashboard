import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RestuarantRepository } from './restaurant.repository';
import { UpdateRestaurantDetailsDTO } from './dto/restaurant.dto';
import { Invoice, Restaurant } from './schema/restaurant.schema';
import { TaskService } from '../integration/tookan/task.service';
import { randomUUID } from 'crypto';
import { TaskRepository } from 'src/integration/tookan/task.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RestuarantService implements OnModuleInit {
	constructor(
		private readonly _restaurantRepository: RestuarantRepository,
		private readonly _tookanTaskRepository: TaskRepository,
		private readonly _tookanTaskService: TaskService) { }

	async onModuleInit() {
		let restaurants: Restaurant[] = [];
		const rests = await this._tookanTaskService.getRestaurants();

		rests.forEach((n) => {
			if (n.restaurantName) {
				restaurants.push({
					id: randomUUID(),
					name: n.restaurantName,
					isActive: true
				})
			}
		})

		await this._restaurantRepository.createMany(restaurants)
	}

	@Cron(CronExpression.EVERY_30_MINUTES)
	async automatedInvoiceCron() {
		console.log('Called when the current second is 45');

		const today = (new Date()).toISOString().split('T')[0]
		const { results } = await this.findAll();

		const shouldGenerateInvoice = (el) => {
			return el.isActive && el.invoices?.length && el.nextInvoiceDate <= today
		}

		results
			.filter(shouldGenerateInvoice)
			.forEach(async ({ id, lastInvoiceDate, invoiceFrequencyInWeeks }) => {
				const t = new Date(lastInvoiceDate);

				t.setDate(t.getDate() + 1)
				const startDate = t.toISOString().split('T')[0];

				t.setDate(t.getDate() + (invoiceFrequencyInWeeks * 7))
				const endDate = t.toISOString().split('T')[0];

				await this.createInvoice(id, {
					endDate,
					startDate,
					invoiceFrequencyInWeeks
				})

				//send invoice email here.

			});
	}

	_populateInvoiceDetails(invoice: Invoice) {
		const today = new Date()
		invoice.id = randomUUID();
		invoice.dateCreated = today.toISOString().split("T")[0];

		today.setDate(today.getDate() + invoice.invoiceFrequencyInWeeks * 7)
		const lastInvoiceDate = invoice.dateCreated;
		const invoiceFrequencyInWeeks = invoice.invoiceFrequencyInWeeks;
		const nextInvoiceDate = today.toISOString().split("T")[0];

		return { lastInvoiceDate, nextInvoiceDate, invoiceFrequencyInWeeks }
	}

	findById(id: string) {
		return this._restaurantRepository.findOne({ id })
	}

	findAll() {
		return this._restaurantRepository.findAll({})
	}

	findByName(name: string) {
		return this._restaurantRepository.findOne({ name })
	}

	remove(id: string) {
		return this._restaurantRepository.delete({ id: id })
	}

	async getAllInvoices(startDate: string, endDate: string) {
		const { results } = await this._restaurantRepository.findAll({});
		const summaries = await this._tookanTaskService.getTaskForRestaurantForPeriod("", startDate, endDate)

		return results.map((el) => {
			const summary = summaries.find((e) => e.restaurantName == el.name) ?? {};
			const r = el as any;
			r._id = undefined;

			return { ...r, summary }
		})
	}

	async getInvoiceByRestaurant(restaurantName: string, startDate?: string, endDate?: string) {
		const restaurant = await this._restaurantRepository.findOne({ name: restaurantName })
		if (!restaurant) {
			throw new NotFoundException(`${restaurantName} was not found`)
		}

		const summary = await this._tookanTaskService.getTaskForRestaurantForPeriod(restaurantName, startDate, endDate)

		const r = restaurant as any;
		r._id = undefined;

		return { ...r, summary: summary[0] ?? {} }
	}

	updateRestaurantDetails(restaurantId: string, { invoiceFrequencyInWeeks, email, isActive }: UpdateRestaurantDetailsDTO) {
		return this._restaurantRepository.update({ id: restaurantId, }, { $set: { invoiceFrequencyInWeeks, email, isActive } });
	}

	createInvoice(restaurantId: string, invoice: Invoice) {
		const { lastInvoiceDate, invoiceFrequencyInWeeks, nextInvoiceDate } = this._populateInvoiceDetails(invoice);

		return this._restaurantRepository.update({ id: restaurantId }, {
			lastInvoiceDate,
			invoiceFrequencyInWeeks,
			nextInvoiceDate,
			$push: { "invoices": invoice }
		})
	}

	updateInvoice(restaurantId: string, invoiceId: string, invoice: Invoice) {
		const { lastInvoiceDate, invoiceFrequencyInWeeks, nextInvoiceDate } = this._populateInvoiceDetails(invoice);

		return this._restaurantRepository.update({ id: restaurantId, "item.id": invoiceId }, {
			lastInvoiceDate,
			invoiceFrequencyInWeeks,
			nextInvoiceDate,
			$set: { "invoices.$": invoice }
		})
	}

	removeInvoice(restaurantId: string, id: string) {
		return this._restaurantRepository.update({ id: restaurantId },
			[
				{ "invoices.id": id },
				{ "$pull": { "invoices.$": { "id": id } } }
			]
		)
	}

	async getStatistic(restaurantName?: string, startDate?: string, endDate?: string) {
		const restaurants = await this.getActiveRestaurants(startDate, endDate);
		const periodData = await this.getTotalPriceForRestaurantForPeriod(restaurantName, startDate, endDate);
		const monthlySummary = await this.getTotalPriceForEachMonth(startDate, restaurantName)
		const paymentMethodSummary = await this.getPaymentMethodSummary(restaurantName, startDate, endDate);

		const restaurantSummary = periodData.map(({ totalDeliveryFee, restaurantName, totalJobs, totalPrice, jobStatus, items }) => {
			const isDelivery = (name) => name == "DELIVERY_FEE";

			const summary = items.reduce((cur, prev) => {
				const summary = {
					itemDiscount: cur.itemDiscount + prev.itemDiscount,
					totalDeliveryFee: isDelivery(prev.name) ? cur.totalDeliveryFee + prev.totalItemPrice : cur.totalDeliveryFee,
					taxRate: Number(cur.taxRate) + prev.taxRate,
					taxValue: Number(cur.taxValue) + prev.taxValue
				}
				return summary
			}, { totalDeliveryFee: 0, itemDiscount: 0, taxValue: 0, taxRate: 0 })

			return {
				restaurantName: restaurantName,
				totalJobs: totalJobs,
				totalPrice: totalPrice,
				jobStatus: jobStatus,
				totalDeliveryFee: totalDeliveryFee || summary.totalDeliveryFee,
				totalTaxRate: summary.taxRate,
				totalTaxValue: summary.taxValue,
				totalDiscount: summary.itemDiscount,
			}

		})

		return {
			paymentMethodSummary,
			monthlySummary,
			totalActiveRestaurants: restaurantName ? undefined : restaurants.length,
			restaurantSummary: restaurantName ? restaurantSummary[0] : restaurantSummary,
		}
	}

	getTotalPriceForRestaurantForPeriod(restaurantName?: string, startDate?: string, endDate?: string) {
		let pipelines = [];

		if (restaurantName) {
			pipelines.push({
				$match: { "restaurantName": restaurantName }
			})
		}

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
				jobStatus: {
					$first: "$jobStatus"
				},
				totalJobs: {
					$sum: 1
				},
				totalPrice: {
					$sum: "$totalPrice"
				},
				totalDeliveryFee: {
					$sum: "$deliveryFee"
				},
				"items": {
					$push: "$items"
				}
			}
		})

		pipelines.push({
			$project: {
				restaurantName: "$_id",
				totalJobs: 1,
				totalPrice: 1,
				totalDeliveryFee: 1,
				jobStatus: 1,
				"items": {
					$reduce: {
						input: '$items',
						initialValue: [],
						in: { $concatArrays: ['$$value', '$$this'] }
					}
				}
			}
		})

		return this._tookanTaskRepository.aggregate(pipelines)
	}


	getPaymentMethodSummary(restaurantName?: string, startDate?: string, endDate?: string) {
		let pipelines = [];

		if (restaurantName) {
			pipelines.push({
				$match: { "restaurantName": restaurantName }
			})
		}

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
				_id: "$paymentMethod",
				total: {
					$sum: 1
				},
				totalPrice: {
					$sum: "$totalPrice"
				},
				totalDeliveryFee: {
					$sum: "$deliveryFee"
				}
			}
		})

		pipelines.push({
			$project: {
				paymentMethod: "$_id",
				total: 1,
				totalPrice: 1,
				totalDeliveryFee: 1
			}
		})

		return this._tookanTaskRepository.aggregate(pipelines)
	}


	getTotalPriceForEachMonth(startDate?: string, restaurantName?: string) {
		let pipelines = [];

		if (restaurantName) {
			pipelines.push({
				$match: { "restaurantName": restaurantName }
			})
		}

		if (startDate) {
			const year = startDate.split("-")[0]

			pipelines.push({
				$match: {
					dateCreated: { $gte: `${year}-01-01`, $lte: `${year}-12-31` }
				}
			});
		}

		pipelines.push({
			$group: {
				_id: { $substr: ['$creationDatetime', 0, 7] },
				totalJobs: {
					$sum: 1
				},
				totalPrice: {
					$sum: "$totalPrice"
				},
				totalDeliveryFee: {
					$sum: "$deliveryFee"
				}
			}
		})

		pipelines.push({
			$project: {
				month: "$_id",
				totalJobs: 1,
				totalPrice: 1,
				totalDeliveryFee: 1,
				jobStatus: 1
			}
		})

		return this._tookanTaskRepository.aggregate(pipelines)
	}

	getActiveRestaurants(startDate?: string, endDate?: string) {
		let pipelines = [];

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
			}
		})

		return this._tookanTaskRepository.aggregate(pipelines)
	}



}
