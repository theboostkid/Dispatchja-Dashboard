import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantRepository } from './merchant.repository';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { Merchant, MerchantSchema } from './schema/merchant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
    ]),
  ],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantRepository],
  exports: [MerchantService],
})
export class MerchantModule {}
