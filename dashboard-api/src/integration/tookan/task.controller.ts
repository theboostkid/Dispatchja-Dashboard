import {
  Controller,
  Get,
  Post,
  HttpCode,
  BadRequestException,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { fileFilter } from 'src/core/filters/multer.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import RoleGuard from 'src/auth/role.guard';
import { Role } from 'src/users/schema/user.schema';
import { TaskService } from './task.service';
import { SearchQueryParams } from './dto/task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/tookan/tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly _taskService: TaskService) {}

  @Post('/upload')
  @HttpCode(204)
  @UseGuards(RoleGuard([Role.SUPER_USER, Role.ADMIN]))
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      limits: { fileSize: 1024 * 1024 * 40 },
      fileFilter: fileFilter(/csv/),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const errors = await this._taskService.processFile(file);
    if (errors) {
      throw new BadRequestException(errors);
    }
  }

  @Get('/')
  @UseGuards(
    RoleGuard([
      Role.ADMIN,
      Role.SUPER_USER,
      Role.RESTUARANT,
      Role.RESTUARANT_STAFF,
    ]),
  )
  getTasks(@Query() searchQuery: SearchQueryParams) {
    const { merchantName, startDate, endDate, jobStatus } = searchQuery;
    return this._taskService.getTasks(
      merchantName,
      startDate,
      endDate,
      jobStatus,
    );
  }

  @Get('/statistics')
  @UseGuards(
    RoleGuard([
      Role.ADMIN,
      Role.SUPER_USER,
      Role.RESTUARANT,
      Role.RESTUARANT_STAFF,
    ]),
  )
  getMerchantStatistic(@Query() searchQuery: SearchQueryParams) {
    const { period, merchantName, startDate, endDate, jobStatus } = searchQuery;
    return this._taskService.getStatistic(
      period,
      merchantName,
      startDate,
      endDate,
      jobStatus,
    );
  }
}
