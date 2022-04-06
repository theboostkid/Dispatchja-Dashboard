import { Module } from '@nestjs/common';
import { TaskService } from './tookan/tasks/task.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TaskRepository } from './tookan/tasks/task.repository';
import { Task, TaskSchema } from './tookan/tasks/schema/task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantModule } from 'src/merchant/merchant.module';
import { TasksController } from './tookan/tasks/task.controller';
import { AgentsController } from './tookan/agents/agent.controller';
import { AgentService } from './tookan/agents/agent.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    EmailModule,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MerchantModule,
  ],
  controllers: [TasksController, AgentsController],
  providers: [TaskService, TaskRepository, AgentService],
})
export class IntegrationModule {}
