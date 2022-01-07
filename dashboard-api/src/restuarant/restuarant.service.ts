import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RestuarantRepository } from './restaurant.repository';
import { UpdateRestaurantDetailsDTO } from './dto/restaurant.dto';
import { Invoice, Restaurant } from './schema/restaurant.schema';
import { TaskService } from '../integration/tookan/task.service';
import { randomUUID } from 'crypto';
import { TaskRepository } from 'src/integration/tookan/task.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

type GroupByOptions = {
	propertyToGroupBy?: 'restaurantName' | 'paymentMethod';
	restaurantName?: string;
	startDate?: string;
	endDate?: string;
	returnItems?: boolean;
	jobStatus?: number;
}

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

				//(sum of all completed orders including delivery fees) - 
				//all delivery fees - all card transaction fees (4% of all card transactions) = amount owed to merchant

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
		invoice.id = randomUUID();

		const today = new Date()
		invoice.dateCreated = today.toISOString().split("T")[0];
		const endDate = new Date(invoice.endDate)

		endDate.setDate(endDate.getDate() + invoice.invoiceFrequencyInWeeks * 7)
		const lastInvoiceDate = invoice.dateCreated;
		const invoiceFrequencyInWeeks = invoice.invoiceFrequencyInWeeks;
		const nextInvoiceDate = endDate.toISOString().split("T")[0];

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

	async getStatistic(restaurantName?: string, startDate?: string, endDate?: string, jobStatus?: number) {
		const groupByOptions: GroupByOptions = {
			restaurantName,
			startDate,
			endDate,
		}

		const periodData = await this.getTotalBreakDownGroupedByField({ ...groupByOptions, propertyToGroupBy: 'restaurantName', returnItems: true, jobStatus });
		const monthlySummary = await this.getTotalPriceForEachMonth(startDate, restaurantName)

		let paymentMethodSummary;
		if (!restaurantName) {
			paymentMethodSummary = await this.getTotalBreakDownGroupedByField({ ...groupByOptions, propertyToGroupBy: 'paymentMethod', returnItems: false, jobStatus });
			paymentMethodSummary.forEach((el) => {
				delete el.totalCashTransactions
				delete el.totalCardTransactions
			})
		}

		return {
			monthlySummary,
			paymentMethodSummary: restaurantName ? undefined : paymentMethodSummary,
			restaurantSummary: restaurantName ? periodData[0] : periodData
		}
	}

	async getTotalPriceForEachMonth(startDate?: string, restaurantName?: string, jobStatus?: number) {
		let pipelines = [];

		if (restaurantName) {
			pipelines.push({
				$match: { "restaurantName": restaurantName, jobStatus: jobStatus || 2 }
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
				items: {
					$push: "$items"
				},
			}
		})

		pipelines.push({
			$project: {
				month: "$_id",
				totalJobs: 1,
				totalPrice: 1,
				"items": {
					$reduce: {
						input: '$items',
						initialValue: [],
						in: { $concatArrays: ['$$value', '$$this'] }
					}
				}
			}
		})

		const data = await this._tookanTaskRepository.aggregate(pipelines);

		return this._getMappedTotals(data);
	}

	async getTransactions(restaurantName?: string, startDate?: string, endDate?: string, jobStatus?: number) {
		let pipelines = [];

		if (restaurantName) {
			pipelines.push({
				$match: { "restaurantName": restaurantName, jobStatus: jobStatus || 2 }
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

		const data = await this._tookanTaskRepository.aggregate(pipelines);

		return this._getMappedTotals(data, true, true);
	}

	_summarizeItems(items) {
		const isDelivery = (name) => name === "DELIVERY_FEE";
		const isCash = (paymentMethod) => paymentMethod === "CASH";

		const summary = items.reduce((cur, prev) => {
			const isDeliveryFee = isDelivery(prev.name);
			const isCashTransaction = isCash(prev.paymentMethod);

			const summary = {
				totalCashTransactions: isCashTransaction ? cur.totalCashTransactions + prev.totalItemPrice - prev.itemDiscount : cur.totalCashTransactions,
				totalCardTransactions: !isCashTransaction ? cur.totalCardTransactions + prev.totalItemPrice - prev.itemDiscount : cur.totalCardTransactions,
				itemDiscount: cur.itemDiscount + prev.itemDiscount,
				totalDeliveryFee: isDeliveryFee ? cur.totalDeliveryFee + prev.totalItemPrice : cur.totalDeliveryFee,
				totalWithoutDeliveryFee: !isDeliveryFee ? cur.totalWithoutDeliveryFee + prev.totalItemPrice : cur.totalWithoutDeliveryFee,
				taxRate: Number(cur.taxRate) + prev.taxRate,
				taxValue: Number(cur.taxValue) + prev.taxValue
			};

			return summary
		},
			{
				totalCashTransactions: 0,
				totalCardTransactions: 0,
				totalWithoutDeliveryFee: 0,
				totalDeliveryFee: 0,
				itemDiscount: 0,
				taxValue: 0,
				taxRate: 0
			})
		return summary;
	}

	private _getMappedTotals(data: any[], returnItems?: boolean, includeOtherProperties?: boolean) {
		return data.map((el) => {
			const { month, restaurantName, paymentMethod, totalJobs, totalPrice, items } = el;
			const summary = this._summarizeItems(items);
			let results = {
				month,
				restaurantName,
				paymentMethod,
				totalJobs,
				totalPriceWithDiscount: totalPrice,
				totalWithoutDeliveryFeeAndDiscount: summary.totalWithoutDeliveryFee - summary.itemDiscount,
				totalDeliveryFee: summary.totalDeliveryFee,
				totalTaxRate: summary.taxRate,
				totalTaxValue: summary.taxValue,
				totalDiscount: summary.itemDiscount,
				totalCashTransactions: summary.totalCashTransactions,
				totalCardTransactions: summary.totalCardTransactions,
				items: returnItems ? items : undefined
			}

			delete el.items;
			delete el.totalPrice;

			if (includeOtherProperties) {
				results = { ...results, ...el };
			}

			results["totalOwedToMerchant"] = results.totalPriceWithDiscount - (results.totalCardTransactions * 0.04);
			return results;
		})
	}

	private async getTotalBreakDownGroupedByField({ propertyToGroupBy, restaurantName, startDate, endDate, returnItems, jobStatus }: GroupByOptions) {
		let pipelines = [];

		if (restaurantName) {
			pipelines.push({
				$match: { "restaurantName": restaurantName, jobStatus: jobStatus || 2 }
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
				_id: `$${propertyToGroupBy}`,
				totalJobs: {
					$sum: 1
				},
				totalPrice: {
					$sum: "$totalPrice"
				},
				items: {
					$push: "$items"
				},

			}
		})

		const projection = {
			$project: {
				totalJobs: 1,
				totalPrice: 1,
				"items": {
					$reduce: {
						input: '$items',
						initialValue: [],
						in: { $concatArrays: ['$$value', '$$this'] }
					}
				}
			}
		};
		projection['$project'][`${propertyToGroupBy}`] = '$_id'
		pipelines.push(projection)

		const data = await this._tookanTaskRepository.aggregate(pipelines);

		return this._getMappedTotals(data, returnItems);
	}
}
