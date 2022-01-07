import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Item {
	@Prop()
	id?: string;

	@Prop()
	name?: string;

	@Prop()
	quantity?: number;

	@Prop()
	price?: number;

	@Prop()
	taxRate?: number;

	@Prop()
	taxValue?: number;

	@Prop()
	itemDiscount?: number;

	@Prop()
	totalItemPrice?: number;

	@Prop()
	paymentMethod?: string;

	@Prop()
	instructions?: string
}
export const ItemSchema = SchemaFactory.createForClass(Item);

@Schema()
export class Task {
	@Prop()
	fleetId?: string;

	@Prop()
	fleetName?: string;

	@Prop()
	fleetPhone?: string;

	@Prop()
	fleetLatitude?: string;

	@Prop()
	fleetLongitude?: string;

	@Prop()
	fleetImage?: string;

	@Prop()
	orderId?: string;

	@Prop()
	jobPickupName?: string;

	@Prop()
	jobPickupPhone?: string;

	@Prop()
	userId?: number;

	@Prop()
	timezone?: string;

	@Prop()
	jobLatitude?: string;

	@Prop()
	jobLongitude?: string;

	@Prop()
	jobAddress?: string;

	@Prop()
	jobStatus?: number;

	@Prop()
	jobDescription?: string;

	@Prop()
	hasPickup?: number;

	@Prop()
	pickupDeliveryRelationship?: string;

	@Prop()
	completedByAdmin?: number;

	@Prop()
	jobPickupDatetime?: string;

	@Prop()
	jobId?: number;

	@Prop()
	jobDeliveryDatetime?: string;

	@Prop()
	jobType?: number;

	@Prop()
	creationDatetime?: string;

	@Prop()
	dateCreated?: string;

	@Prop()
	customerComment?: string;

	@Prop()
	jobPickupLatitude?: string;

	@Prop()
	jobPickupLongitude?: string;

	@Prop()
	jobPickupAddress?: string;

	@Prop()
	customerId?: number;

	@Prop()
	customerUsername?: string;

	@Prop()
	customerPhone?: string;

	@Prop()
	customerEmail?: string;

	@Prop()
	daysStarted?: string;

	@Prop()
	startedDatetime?: string;

	@Prop()
	completedDatetime?: string;

	@Prop()
	acknowledgedDatetime?: string;

	@Prop()
	arrivedDatetime?: string;

	@Prop()
	totalDistanceTravelled?: number;

	@Prop()
	teamId?: number;

	@Prop()
	fleetRating?: number;

	@Prop()
	trackingLink?: number;

	@Prop()
	updateAddressLink?: number;

	@Prop()
	isRatingCommentEnabled?: number;

	@Prop()
	restaurantName?: string;

	@Prop()
	restaurantPhone?: string;

	@Prop()
	restaurantAddress?: string;

	@Prop()
	restaurantId?: string;

	@Prop()
	clientName?: string;

	@Prop()
	clientPhone?: string;

	@Prop()
	clientAddress?: string;

	@Prop()
	totalPrice?: number;

	@Prop()
	deliveryFee?: number;

	@Prop()
	instructions?: string;

	@Prop()
	paymentMethod?: string;

	@Prop({ type: [ItemSchema] })
	items?: Item[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);