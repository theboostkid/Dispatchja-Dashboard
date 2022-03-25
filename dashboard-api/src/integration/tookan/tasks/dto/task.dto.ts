import { IsOptional, IsIn, IsString } from 'class-validator';

export class SearchQueryParams {
  @IsOptional()
  @IsIn(['weekly', 'monthly'])
  period?: string;

  @IsOptional()
  @IsString()
  merchantName?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  jobStatus?: number;
}
