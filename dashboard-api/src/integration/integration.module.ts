import { Module } from '@nestjs/common';
import { TaskService } from './tookan/task.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TaskRepository } from './tookan/task.repository';
import { Task, TaskSchema } from './tookan/schema/task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantModule } from 'src/merchant/merchant.module';
import { TasksController } from './tookan/task.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MerchantModule,
  ],
  controllers: [TasksController],
  providers: [TaskService, TaskRepository],
})
export class IntegrationModule {}
