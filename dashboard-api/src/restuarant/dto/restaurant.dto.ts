import { IsEmail, IsOptional, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

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

export class UpdateRestaurantDetailsDTO {
	@IsNumber()
	@IsOptional()
	invoiceFrequencyInWeeks?: number;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}

export class InvoiceDTO {
	@IsDateString()
	@IsNotEmpty()
	startDate: string;

	@IsDateString()
	@IsNotEmpty()
	endDate: string;

	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Max(52)
	invoiceFrequencyInWeeks: number;
}



export class UpdateInvoiceDTO {
	@IsNumber()
	@IsOptional()
	@Min(0.2)
	totalAmountPaid?: number;
}