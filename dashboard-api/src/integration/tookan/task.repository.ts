
import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';


@Injectable()
export class TaskRepository {
	constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

	async findOne(tasksFilterQuery: FilterQuery<TaskDocument>): Promise<Task> {
		return this.taskModel.findOne(tasksFilterQuery);
	}

	async findAll(taskFilterQuery: FilterQuery<TaskDocument>, skip: number = 0, limit: number = 0): Promise<{ results: Task[], count: number }> {
		const countQuery = this.taskModel.find(taskFilterQuery);
		const query = this.taskModel.find(taskFilterQuery).sort({ startedDatetime: -1 }).skip(skip * limit)

		if (limit) {
			query.limit(+limit)
		}

		const results = await query.exec();
		const count = await countQuery.count();
		return { results, count };
	}

	async create(task: Task): Promise<Task> {
		const createdUser = new this.taskModel(task);
		return createdUser.save();
	}

	async createMany(tasks: Task[]) {
		return this.taskModel.bulkWrite(tasks.map(task => ({
			updateOne: {
				filter: { jobId: task.jobId },
				update: task,
				upsert: true,
			}
		})))
	}

	async aggregate(pipeline: any[], options?: any) {
		return this.taskModel.aggregate(pipeline, options);
	}

	async update(tasksFilterQuery: FilterQuery<TaskDocument>, task: Partial<Task>): Promise<Task> {
		return this.taskModel.findOneAndUpdate(tasksFilterQuery, task, { new: true });
	}
}
