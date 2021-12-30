import { Injectable, OnModuleInit } from '@nestjs/common';
import { RestuarantRepository } from './restaurant.repository';
import { UpdateRestaurantInvoiceFrequency } from './dto/restaurant.dto';
import { Invoice, Restaurant } from './schema/restaurant.schema';
import { TookanService } from '../integration/tookan/tookan.service';
import { randomUUID } from 'crypto';

@Injectable()
export class RestuarantService implements OnModuleInit {
	constructor(
		private readonly _restaurantRepository: RestuarantRepository,
		private readonly _tookanService: TookanService) { }

	async onModuleInit() {
		let restaurants: Restaurant[] = [];
		const names = await this._tookanService.getRestaurants();

		names.forEach((n) => {
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

	_populateInvoiceDetails(invoice: Invoice) {
		const today = new Date()
		invoice.id = randomUUID();
		invoice.status = "paid";
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

	findByName(name: string) {
		return this._restaurantRepository.findOne({ name })
	}

	remove(id: string) {
		return this._restaurantRepository.delete({ id: id })
	}

	async getAllInvoices(startDate: string, endDate: string) {
		const { results } = await this._restaurantRepository.findAll({});
		const summaries = await this._tookanService.getTaskForRestaurantForPeriod("", startDate, endDate)

		return results.map((el) => {
			const summary = summaries.find((e) => e.restaurantName == el.name) ?? {};
			const r = el as any;
			r._id = undefined;

			return { ...r, summary }
		})
	}

	async getInvoiceByRestaurant(restaurantName: string, startDate?: string, endDate?: string) {
		const restaurant = await this._restaurantRepository.findOne({ name: restaurantName })

		const summary = await this._tookanService.getTaskForRestaurantForPeriod(restaurantName, startDate, endDate)

		const r = restaurant as any;
		r._id = undefined;

		return { ...r, summary: summary[0] ?? {} }
	}

	updateInvoiceFrequency(restaurantId: string, invoiceFrequencyInWeeks: UpdateRestaurantInvoiceFrequency) {
		return this._restaurantRepository.update({ id: restaurantId, }, { $set: { ...invoiceFrequencyInWeeks } });
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

}
