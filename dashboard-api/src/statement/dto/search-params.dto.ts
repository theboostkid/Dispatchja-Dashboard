import {
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StatementSearchQueryParams {
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
  @IsBoolean()
  paginated?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
