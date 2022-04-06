import { Injectable } from '@nestjs/common';
import { MerchantRepository } from './merchant.repository';
import { CreateMerchantDTO, UpdateMerchantDTO } from './dto/merchant.dto';
import { Statement } from './schema/merchant.schema';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';

@Injectable()
export class MerchantService {
  constructor(private readonly _merchantRepository: MerchantRepository) {}

  _populateStatementDetails(statement: Statement) {
    statement.id = randomUUID();
    const statementFrequencyInWeeks = statement.statementFrequencyInWeeks;

    const today = new Date();
    statement.dateCreated = today.toISOString().split('T')[0];

    const lastStatementDate = statement.endDate;
    const endDate = new Date(statement.endDate);

    const daysFromLastInvoice = statement.statementFrequencyInWeeks * 7;

    endDate.setDate(endDate.getDate() + daysFromLastInvoice);
    const nextStatementDate = endDate.toISOString().split('T')[0];

    return { lastStatementDate, nextStatementDate, statementFrequencyInWeeks };
  }

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
    const merch = await this._merchantRepository.create({
      id: randomUUID(),
      ...merchant,
    });

    await this.createStatement(merch.id, {
      startDate: merchant.startDate,
      endDate: merchant.endDate,
      statementFrequencyInWeeks: merchant.statementFrequencyInWeeks,
    });

    return this.findById(merch.id);
  }

  async update(merchantId: string, merchant: UpdateMerchantDTO) {
    const existingMerchant = await this.findById(merchantId);
    const lastStatement = existingMerchant?.statements.pop() || null;
    if (!lastStatement) return {};

    await this.updateStatement(merchantId, lastStatement.id, {
      startDate: merchant.startDate,
      endDate: merchant.endDate,
      statementFrequencyInWeeks: merchant.statementFrequencyInWeeks,
    });

    return this._merchantRepository.update(
      { id: merchantId },
      { $set: { ...merchant } },
    );
  }

  findById(id: string) {
    return this._merchantRepository.findOne({ id });
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

  createStatement(merchantId: string, statement: Statement) {
    const { lastStatementDate, statementFrequencyInWeeks, nextStatementDate } =
      this._populateStatementDetails(statement);

    return this._merchantRepository.update(
      { id: merchantId },
      {
        lastStatementDate,
        statementFrequencyInWeeks,
        nextStatementDate,
        $push: { statements: statement },
      },
    );
  }

  updateStatement(
    merchantId: string,
    statementId: string,
    statement: Statement,
  ) {
    const { lastStatementDate, statementFrequencyInWeeks, nextStatementDate } =
      this._populateStatementDetails(statement);

    return this._merchantRepository.update(
      { id: merchantId, 'statements.id': statementId },
      {
        lastStatementDate,
        statementFrequencyInWeeks,
        nextStatementDate,
        $set: { 'statements.$': statement },
      },
    );
  }
}
