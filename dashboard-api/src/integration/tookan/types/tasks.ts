import { IsOptional, IsIn, IsString } from 'class-validator';

export class GetAllTasksRequest {
  api_key: string;
  job_type: number;
  job_status?: number;
  requested_page?: number;
  start_date?: string;
  end_date?: string;
  custom_fields?: 0 | 1;
  is_pagination?: 0 | 1;
  customer_id?: string;
  fleet_id?: number;
  job_id?: Array<number>;
  order_id?: Array<string>;
  team_id?: number;
}

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
