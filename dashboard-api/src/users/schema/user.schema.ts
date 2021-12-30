import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
	SUPER_USER = "superuser",
	ADMIN = "admin",
	RESTUARANT = "restaurant",
	RESTUARANT_STAFF = "restaurant-staff",
}

@Schema()
export class User {
	@Prop()
	id: string;

	@Prop()
	name: string;

	@Prop()
	email: string;

	@Prop()
	tookanUserId?: string;

	@Prop()
	password: string;

	@Prop()
	resetPasswordToken?: string;

	@Prop()
	restaurantName?: string;

	@Prop()
	restaurantId?: string;

	@Prop(Role)
	role: Role;

	@Prop()
	isDeleted?: boolean;

	@Prop()
	isActive: boolean;

	@Prop()
	loginAttempts: number;

	@Prop()
	shouldChangePassword?: boolean;

	@Prop()
	lastLogoutDate?: string;

	@Prop()
	lastLoginDate?: string;
}


export const UserSchema = SchemaFactory.createForClass(User);