import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateMerchantDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  province: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  country: string;

  @IsEmail()
  @IsOptional()
  email?: string;

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
  statementFrequencyInWeeks: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateMerchantDTO extends PartialType(CreateMerchantDTO) {}

export class StatementDTO {
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
  statementFrequencyInWeeks: number;
}
