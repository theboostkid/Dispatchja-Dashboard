import { Module } from '@nestjs/common';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import {
  Statement,
  StatementSchema,
} from 'src/statement/schema/statement.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantModule } from 'src/merchant/merchant.module';
import { EmailModule } from 'src/email/email.module';
import { IntegrationModule } from 'src/integration/integration.module';
import { StatementRepository } from './statement.repository';

@Module({
  imports: [
    MerchantModule,
    IntegrationModule,
    EmailModule,
    MongooseModule.forFeature([
      { name: Statement.name, schema: StatementSchema },
    ]),
  ],
  controllers: [StatementController],
  providers: [StatementService, StatementRepository],
  exports: [StatementService],
})
export class StatementModule {}
