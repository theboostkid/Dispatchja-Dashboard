import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Merchant, MerchantDocument } from './schema/merchant.schema';

@Injectable()
export class MerchantRepository {
  constructor(
    @InjectModel(Merchant.name) private merchantModel: Model<MerchantDocument>,
  ) {}

  async findOne(
    MerchantsFilterQuery: FilterQuery<MerchantDocument>,
  ): Promise<Merchant> {
    return this.merchantModel.findOne(MerchantsFilterQuery).lean();
  }

  async findAll(
    MerchantFilterQuery: FilterQuery<MerchantDocument>,
    skip = 0,
    limit = 0,
  ): Promise<{ results: Merchant[]; count: number }> {
    const countQuery = this.merchantModel.find(MerchantFilterQuery);
    const query = this.merchantModel
      .find(MerchantFilterQuery)
      .sort({ _id: 1 })
      .skip(skip * limit);

    if (limit) {
      query.limit(+limit);
    }

    const results = await query.lean();
    const count = await countQuery.count();
    return { results, count };
  }

  async create(merchant: Merchant): Promise<Merchant> {
    const createdUser = new this.merchantModel(merchant);
    return createdUser.save();
  }

  async createMany(rests: Merchant[]) {
    return this.merchantModel.bulkWrite(
      rests.map((rest) => ({
        updateOne: {
          filter: { name: rest.name },
          update: {
            $set: { name: rest.name },
            $setOnInsert: { id: rest.id, isActive: rest.isActive },
          },
          upsert: true,
        },
      })),
    );
  }

  async update(
    merchantsFilterQuery: FilterQuery<MerchantDocument>,
    updateQuery: UpdateQuery<MerchantDocument>,
  ): Promise<Merchant> {
    return this.merchantModel.findOneAndUpdate(
      merchantsFilterQuery,
      updateQuery,
      { new: true },
    );
  }

  async updateManyStatements(rests: Merchant[]) {
    return this.merchantModel.bulkWrite(
      rests.map((rest) => ({
        updateOne: {
          filter: { id: rest.id },
          update: {
            $set: {
              statementFrequencyInWeeks: rest.statementFrequencyInWeeks,
              statementDate: rest.statementDay,
            },
          },
        },
      })),
    );
  }

  async delete(merchantsFilterQuery: FilterQuery<MerchantDocument>) {
    return this.merchantModel.deleteOne(merchantsFilterQuery);
  }
}
