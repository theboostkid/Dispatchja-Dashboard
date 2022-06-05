import { IsOptional, IsIn, IsString } from 'class-validator';

export class SearchQueryParams {
  @IsOptional()
  @IsString()
  fleetId?: number;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsIn(['weekly', 'monthly'])
  period?: string;

  @IsOptional()
  @IsString()
  merchantName?: string;

  @IsOptional()
  @IsString()
  merchantId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  jobStatus?: number;
}
