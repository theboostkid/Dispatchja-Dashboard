import { Injectable } from '@nestjs/common';
import { StatementRepository } from './statement.repository';
import { randomUUID } from 'crypto';
import { TaskService } from 'src/integration/tookan/tasks/task.service';
import { Merchant } from 'src/merchant/schema/merchant.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';
import { MerchantService } from 'src/merchant/merchant.service';
import { Types as MongoTypes } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class StatementService {
  constructor(
    private readonly _taskService: TaskService,
    private readonly _merchantService: MerchantService,
    private readonly _statementRepository: StatementRepository,
    private readonly _emailService: EmailService,
  ) {}

  async create(merchant: Merchant) {
    const result = await this._taskService.getStatistic(
      'weekly',
      undefined,
      merchant.merchantId,
      merchant.currentStatementStartDate,
      merchant.currentStatementEndDate,
    );

    const summary = result.merchantSummary;
    const createdStatement = await this._statementRepository.create({
      id: randomUUID(),
      ...{
        merchant: merchant._id,
        startDate: new Date(merchant.currentStatementStartDate),
        endDate: new Date(merchant.currentStatementEndDate),
        dateCreated: moment().format('YYYY-MM-DD'),
      },
      ...summary,
    });

    const nextStartDate = merchant.nextStatementDate;
    const nextEndDate = moment(nextStartDate)
      .add(merchant.statementFrequencyInWeeks, 'weeks')
      .format('YYYY-MM-DD');

    const updatedMerchant = await this._merchantService.update(
      merchant.merchantId,
      {
        lastStatementId: createdStatement.id,
        currentStatementStartDate: nextStartDate,
        currentStatementEndDate: nextEndDate,
        lastStatementDate: merchant.currentStatementEndDate,
        nextStatementDate: moment(nextEndDate)
          .add(1, 'days')
          .format('YYYY-MM-DD'),
      },
    );

    return { merchant: updatedMerchant, statement: createdStatement };
  }

  findAll(
    merchantId?: string,
    startDate?: string,
    endDate?: string,
    skip?: number,
    limit?: number,
  ) {
    const filter = {};
    if (merchantId) {
      filter['merchant'] = new MongoTypes.ObjectId(merchantId);
    }

    if (startDate && endDate) {
      filter['$and'] = [{ startDate: { $gte: new Date(startDate) } }];

      if (endDate) {
        filter['$and'].push({ endDate: { $lte: new Date(endDate) } });
      }
    } else if (startDate) {
      filter['startDate'] = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter['endDate'] = { $lte: new Date(endDate) };
    }

    return this._statementRepository.findAll(filter, skip, limit);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async automatedStatementReportCron() {
    const { results } = await this._merchantService.findAll();

    const today = new Date();
    const shouldGenerateStatement = (el) =>
      el.isActive && new Date(el.currentStatementEndDate) < today;

    results.filter(shouldGenerateStatement).forEach(async (merchant) => {
      const { merchantSummary } = await this._taskService.getStatistic(
        null,
        undefined,
        merchant.merchantId,
        merchant.currentStatementStartDate,
        merchant.currentStatementEndDate,
      );

      await this._emailService.sendEmail({
        to: merchant.email,
        subject: 'Transaction Report',
        template: './statement',
        context: {
          merchantName: merchant.name,
          address: merchant.address,
          province: merchant.province,
          country: merchant.country,
          startDate: merchant.currentStatementStartDate,
          endDate: merchant.currentStatementEndDate,
          numberOfTransactions: merchantSummary['totalJobs'],
          merchantSummary: {
            totalPrice: (
              merchantSummary['totalPriceWithDiscount'] || 0
            ).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            totalCashTransactions:
              merchantSummary['totalCashTransactions']?.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              ) || 0,
            cardFees:
              (
                Number(merchantSummary['totalCardTransactions']) * 0.04
              )?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0,
            totalCardTransactions:
              merchantSummary['totalCardTransactions']?.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              ) || 0,
          },
        },
      });
      console.log('[info] statement sent email');

      await this.create(merchant);
    });
  }
}
