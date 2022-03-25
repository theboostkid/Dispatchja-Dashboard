import {
  Body,
  Controller,
  Param,
  Post,
  Delete,
  Request,
  ForbiddenException,
  Get,
  Patch,
  Query,
  HttpCode,
  NotFoundException,
  BadRequestException,
  UseGuards,
  ConflictException,
} from '@nestjs/common';

import { CreateMerchantDTO, UpdateMerchantDTO } from './dto/merchant.dto';
import { MerchantService } from './merchant.service';
import { Role, User } from '../users/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from 'src/auth/role.guard';
import * as moment from 'moment';

@Controller('merchants')
@UseGuards(AuthGuard('jwt'))
export class MerchantController {
  constructor(private readonly _merchantService: MerchantService) {}

  @Post('/')
  @UseGuards(RoleGuard([Role.SUPER_USER]))
  async createMerchant(@Body() merchantDTO: CreateMerchantDTO) {
    const existMsg = await this._merchantService.checkIfMerchantExist({
      merchantId: merchantDTO.merchantId,
      name: merchantDTO.name,
      id: null,
    });
    if (existMsg) {
      throw new ConflictException(existMsg);
    }

    if (merchantDTO.startDate > merchantDTO.endDate) {
      throw new BadRequestException([
        'startDate cannot be greater than endDate',
      ]);
    }

    const today = moment().toISOString();
    const endDate = moment(merchantDTO.endDate).toISOString();
    console.log(today, endDate);
    if (endDate <= today) {
      throw new BadRequestException(['endDate must be greater than today.']);
    }

    return this._merchantService.create(merchantDTO);
  }

  @Patch('/:id')
  @UseGuards(RoleGuard([Role.SUPER_USER]))
  async updateMerchant(
    @Param('id') merchantId: string,
    @Body() updatedDetails: UpdateMerchantDTO,
  ) {
    const merchant = await this._merchantService.findById(merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant with id ${merchantId} not found`);
    }

    const existMsg = await this._merchantService.checkIfMerchantExist({
      merchantId: updatedDetails.merchantId,
      name: updatedDetails.name,
      id: merchantId,
    });
    if (existMsg) {
      throw new ConflictException(existMsg);
    }

    if (updatedDetails.startDate > updatedDetails.endDate) {
      throw new BadRequestException([
        'startDate cannot be greater than endDate',
      ]);
    }

    const today = new Date().toISOString().split('T')[0];
    if (updatedDetails.endDate <= today) {
      throw new BadRequestException(['endDate must be greater than today.']);
    }

    return this._merchantService.update(merchantId, updatedDetails);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(RoleGuard([Role.SUPER_USER]))
  async deleteMerchant(@Param('id') id: string) {
    const merchant = await this._merchantService.findById(id);
    if (!merchant) {
      throw new NotFoundException(`Merchant with id ${id} not found`);
    }

    return this._merchantService.remove(id);
  }

  @Get('/')
  @UseGuards(RoleGuard([Role.SUPER_USER, Role.ADMIN]))
  getMerchants(@Request() req, @Query('merchantName') merchantName: string) {
    const user = req.user as User;
    if (
      (user.role == Role.RESTUARANT || user.role == Role.RESTUARANT_STAFF) &&
      user.merchantName !== merchantName
    ) {
      throw new ForbiddenException();
    }

    if (merchantName) {
      return this._merchantService.findByName(merchantName);
    }

    return this._merchantService.findAll();
  }
}
