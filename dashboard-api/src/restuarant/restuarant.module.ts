import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationModule } from 'src/integration/integration.module';
import { RestuarantRepository } from './restaurant.repository';
import { RestuarantController } from './restuarant.controller';
import { RestuarantService } from './restuarant.service';
import { Restaurant, RestaurantSchema } from './schema/restaurant.schema';

@Module({
  imports: [
    IntegrationModule,
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }])
  ],
  controllers: [RestuarantController],
  providers: [RestuarantService, RestuarantRepository]
})
export class RestuarantModule { }
