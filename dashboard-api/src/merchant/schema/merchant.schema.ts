import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';
import { Types as MongoTypes } from 'mongoose';
export type MerchantDocument = Merchant & Document;

@Schema()
export class Merchant {
  @Transform(({ value }) => value.toString())
  _id?: MongoTypes.ObjectId;

  @Prop()
  id?: string;

  @Prop()
  name?: string;

  @Prop()
  address?: string;

  @Prop()
  province?: string;

  @Prop()
  country?: string;

  @Prop()
  merchantId?: string;

  @Prop()
  email?: string;

  @Prop()
  statementFrequencyInWeeks?: number;

  @Prop()
  statementDay?: number;

  @Prop()
  lastStatementId?: string;

  @Prop()
  currentStatementStartDate?: string;

  @Prop()
  currentStatementEndDate?: string;

  @Prop()
  lastStatementDate?: string;

  @Prop()
  nextStatementDate?: string;

  @Prop()
  isActive?: boolean;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
