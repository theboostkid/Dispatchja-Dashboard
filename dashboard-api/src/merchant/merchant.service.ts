import { Injectable } from '@nestjs/common';
import { MerchantRepository } from './merchant.repository';
import { CreateMerchantDTO, UpdateMerchantDTO } from './dto/merchant.dto';
import { randomUUID } from 'crypto';
import * as moment from 'moment';

@Injectable()
export class MerchantService {
  constructor(private readonly _merchantRepository: MerchantRepository) {}

  /**
   * checks if a merchant name or merchant id already exist
   * @param { merchantId, name, id}
   * @returns a message if merchant exist otherwise returns null
   */
  async checkIfMerchantExist({ merchantId, name, id }) {
    const existingMerchant = await this._merchantRepository.findOne({
      $or: [{ merchantId }, { name }],
    });

    if (existingMerchant && existingMerchant.id !== id) {
      const idExist = existingMerchant.merchantId === merchantId;
      return `Merchant with ${idExist ? 'id' : 'name'} "${
        idExist ? merchantId : name
      }" already exist`;
    }
  }

  async create(merchant: CreateMerchantDTO) {
    merchant.nextStatementDate = moment(merchant.endDate)
      .add(1, 'days')
      .format('YYYY-MM-DD');

    const merch = await this._merchantRepository.create({
      id: randomUUID(),
      ...merchant,
      currentStatementStartDate: merchant.startDate,
      currentStatementEndDate: merchant.endDate,
    });

    return merch;
  }

  async update(merchantId: string, merchant: UpdateMerchantDTO) {
    return this._merchantRepository.update(
      { $or: [{ id: merchantId }, { merchantId: merchantId }] },
      { $set: { ...merchant } },
    );
  }

  findById(id: string) {
    return this._merchantRepository.findOne({ id });
  }

  findByMerchantId(id: string) {
    return this._merchantRepository.findOne({ merchantId: id });
  }

  findAll() {
    return this._merchantRepository.findAll({});
  }

  findByName(name: string) {
    return this._merchantRepository.findOne({ name });
  }

  remove(id: string) {
    return this._merchantRepository.delete({ id: id });
  }
}
