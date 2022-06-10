import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatementSearchQueryParams } from './dto/search-params.dto';
import { StatementService } from './statement.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('statements')
@UseGuards(AuthGuard('jwt'))
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
