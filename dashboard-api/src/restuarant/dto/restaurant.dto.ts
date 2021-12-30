import { HttpCode } from "@nestjs/common";
import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

export class UpdateRestaurantInvoiceFrequency {
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsNotEmpty()
	invoiceFreqencyInWeeks?: string;

	@IsNumber()
	@Max(28)
	invoiceDay?: number;
}

export class InvoiceDTO {
	@IsDateString()
	@IsNotEmpty()
	startDate: string;

	@IsDateString()
	@IsNotEmpty()
	endDate: string;

	@IsString()
	@IsNotEmpty()
	@Min(1)
	@Max(52)
	invoiceFreqencyInWeeks: string;

	@IsNumber()
	@Max(28)
	invoiceDay: number;

	@IsString()
	@IsNotEmpty()
	status: string;
}


