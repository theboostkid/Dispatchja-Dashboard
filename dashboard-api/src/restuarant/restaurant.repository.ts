
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schema/restaurant.schema';


@Injectable()
export class RestuarantRepository {
	constructor(@InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>) { }

	async findOne(RestaurantsFilterQuery: FilterQuery<RestaurantDocument>): Promise<Restaurant> {
		return this.restaurantModel.findOne(RestaurantsFilterQuery).lean();
	}

	async findAll(RestaurantFilterQuery: FilterQuery<RestaurantDocument>, skip: number = 0, limit: number = 0): Promise<{ results: Restaurant[], count: number }> {
		const countQuery = this.restaurantModel.find(RestaurantFilterQuery);
		const query = this.restaurantModel.find(RestaurantFilterQuery).sort({ _id: 1 }).skip(skip * limit)

		if (limit) {
			query.limit(+limit)
		}

		const results = await query.lean();
		const count = await countQuery.count();
		return { results, count };
	}

	async create(restaurant: Restaurant): Promise<Restaurant> {
		const createdUser = new this.restaurantModel(restaurant);
		return createdUser.save();
	}

	async createMany(rests: Restaurant[]) {
		return this.restaurantModel.bulkWrite(rests.map(rest => ({
			updateOne: {
				filter: { name: rest.name },
				update: {
					$set: { name: rest.name },
					$setOnInsert: { id: rest.id, isActive: rest.isActive },
				},
				upsert: true
			}

		})))
	}

	async update(restaurantsFilterQuery: FilterQuery<RestaurantDocument>, updateQuery: UpdateQuery<RestaurantDocument>): Promise<Restaurant> {
		return this.restaurantModel.findOneAndUpdate(restaurantsFilterQuery, updateQuery, { new: true });
	}

	async updateManyInvoices(rests: Restaurant[]) {
		return this.restaurantModel.bulkWrite(rests.map(rest => ({
			updateOne: {
				filter: { id: rest.id },
				update: { $set: { 'invoiceFrequencyInWeeks': rest.invoiceFrequencyInWeeks, "invoiceDate": rest.invoiceDay } },
			}
		})))
	}

	async delete(restaurantsFilterQuery: FilterQuery<RestaurantDocument>) {
		return this.restaurantModel.deleteOne(restaurantsFilterQuery);
	}
}
