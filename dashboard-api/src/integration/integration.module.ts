import { Module } from '@nestjs/common';
import { TookanService } from './tookan/tookan.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TookanTaskRepository } from './tookan/tookantask.repository';
import { Task, TaskSchema } from './tookan/schema/task.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({

  imports: [HttpModule, ConfigModule,
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
    ])
  ],
  providers: [TookanService, TookanTaskRepository],
  exports: [TookanService]
})
export class IntegrationModule { }
