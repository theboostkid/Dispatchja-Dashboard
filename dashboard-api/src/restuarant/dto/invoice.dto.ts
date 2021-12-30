import { IsOptional, Min, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class InvoiceSearchQueryParams {
	@IsOptional()
	@IsString()
	restaurantName?: string;

	@IsOptional()
	@IsString()
	startDate?: string;

	@IsOptional()
	@IsString()
	endDate?: string;
}