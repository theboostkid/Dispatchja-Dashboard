import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MerchantDocument = Merchant & Document;

@Schema()
export class Statement {
  @Prop()
  id?: string;

  @Prop()
  dateCreated?: string;

  @Prop()
  startDate?: string;

  @Prop()
  endDate?: string;

  @Prop()
  totalAmountPaid?: number;

  @Prop()
  totalAmount?: number;

  @Prop()
  totalDeliveryFee?: number;

  @Prop()
  statementFrequencyInWeeks?: number;

  @Prop()
  status?: string;
}
export const StatementSchema = SchemaFactory.createForClass(Statement);

@Schema()
export class Merchant {
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
  lastStatementDate?: string;

  @Prop()
  nextStatementDate?: string;

  @Prop({ type: StatementSchema })
  statements?: Statement[];

  @Prop()
  isActive?: boolean;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
