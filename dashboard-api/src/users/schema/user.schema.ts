import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  SUPER_USER = 'superuser',
  ADMIN = 'admin',
  RESTUARANT = 'merchant',
  RESTUARANT_STAFF = 'merchant-staff',
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
  merchantName?: string;

  @Prop()
  merchantId?: string;

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
