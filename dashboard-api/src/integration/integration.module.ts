import { Module } from '@nestjs/common';
import { TaskService } from './tookan/task.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TaskRepository } from './tookan/task.repository';
import { Task, TaskSchema } from './tookan/schema/task.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({

  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
    ])
  ],
  providers: [TaskService, TaskRepository],
  exports: [TaskService, TaskRepository]
})
export class IntegrationModule { }
