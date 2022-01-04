import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Invoice {
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
	invoiceFrequencyInWeeks?: number;

	@Prop()
	status?: string;
}
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

@Schema()
export class Restaurant {
	@Prop()
	id?: string;

	@Prop()
	name?: string;

	@Prop()
	email?: string;

	@Prop()
	invoiceFrequencyInWeeks?: number;

	@Prop()
	invoiceDay?: number;

	@Prop()
	lastInvoiceDate?: string;

	@Prop()
	nextInvoiceDate?: string;

	@Prop({ type: InvoiceSchema })
	invoices?: Invoice[]

	@Prop()
	isActive?: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);