import { Controller, Get, Query } from '@nestjs/common';
import { StatementSearchQueryParams } from './dto/search-params.dto';
import { StatementService } from './statement.service';

@Controller('statements')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @Get('/')
  async findAll(@Query() searchQuery: StatementSearchQueryParams) {
    return this.statementService.findAll(
      searchQuery.merchantId,
      searchQuery.startDate,
      searchQuery.endDate,
      searchQuery.skip,
      searchQuery.limit,
    );
  }
}
