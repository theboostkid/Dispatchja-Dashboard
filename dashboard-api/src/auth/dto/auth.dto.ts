import { IsEmail, isString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class IdOnlyParams {
	@IsUUID()
	id?: string
}

export class EmailOnlyParams {
	@IsEmail()
	email: string
}