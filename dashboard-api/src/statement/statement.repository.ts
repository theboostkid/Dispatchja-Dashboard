import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Statement, StatementDocument } from './schema/statement.schema';

@Injectable()
export class StatementRepository {
  constructor(
    @InjectModel(Statement.name)
    private statementModel: Model<StatementDocument>,
  ) {}

  async findOne(
    statementsFilterQuery: FilterQuery<StatementDocument>,
  ): Promise<Statement> {
    return this.statementModel
      .findOne(statementsFilterQuery)
      .populate('merchant');
  }

  async findAll(
    statementFilterQuery: FilterQuery<StatementDocument>,
    skip = 0,
    limit = 0,
  ): Promise<{ results: Statement[]; count: number }> {
    const countQuery = this.statementModel.find(statementFilterQuery);
    const query = this.statementModel
      .find(statementFilterQuery)
      .populate('merchant')
      .sort({ dateCreated: -1 })
      .skip(skip * limit);

    if (limit) {
      query.limit(+limit);
    }

    const results = await query.exec();
    const count = await countQuery.count();
    return { results, count };
  }

  async create(statement: Statement): Promise<Statement> {
    const createdUser = new this.statementModel(statement);
    return createdUser.save();
  }

  async createMany(statements: Statement[]) {
    return this.statementModel.bulkWrite(
      statements.map((statement) => ({
        updateOne: {
          filter: { id: statement.id },
          update: { $set: { ...statement } },
          upsert: true,
        },
      })),
    );
  }

  async aggregate(pipeline: any[], options?: any) {
    return this.statementModel.aggregate(pipeline, options);
  }

  async update(
    statementsFilterQuery: FilterQuery<StatementDocument>,
    statement: Partial<Statement>,
  ): Promise<Statement> {
    return this.statementModel.findOneAndUpdate(
      statementsFilterQuery,
      statement,
      {
        new: true,
      },
    );
  }
}
