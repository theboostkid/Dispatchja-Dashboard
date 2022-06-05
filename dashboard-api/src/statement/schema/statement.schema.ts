import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document } from 'mongoose';
import { Types as MongoTypes } from 'mongoose';
import { Merchant } from 'src/merchant/schema/merchant.schema';

export type StatementDocument = Statement & Document;

@Schema()
export class Statement {
  @Transform(({ value }) => value.toString())
  _id?: MongoTypes.ObjectId;

  @Prop()
  id?: string;

  @Prop()
  dateCreated?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  totalJobs?: number;

  @Prop()
  totalPriceWithDiscount?: number;

  @Prop()
  totalWithoutDeliveryFeeAndDiscount?: number;

  @Prop()
  totalDeliveryFee?: number;

  @Prop()
  totalTaxRate?: number;

  @Prop()
  totalTaxValue?: number;

  @Prop()
  totalDiscount?: number;

  @Prop()
  totalCashTransactions?: number;

  @Prop()
  totalCardTransactions?: number;

  @Prop()
  totalOwedToMerchant?: number;

  @Prop({ type: MongoTypes.ObjectId, ref: Merchant.name })
  @Type(() => Merchant)
  merchant?: Merchant | MongoTypes.ObjectId;

  @Prop()
  statementFrequencyInWeeks?: number;
}
export const StatementSchema = SchemaFactory.createForClass(Statement);
