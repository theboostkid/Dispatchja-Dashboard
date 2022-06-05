import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(userFilterQuery: FilterQuery<UserDocument>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async findAll(
    usersFilterQuery: FilterQuery<UserDocument>,
    skip = 0,
    limit = 0,
  ): Promise<{ results: User[]; count: number }> {
    const countQuery = this.userModel.find(usersFilterQuery);
    const query = this.userModel
      .find(usersFilterQuery)
      .sort({ _id: 1 })
      .skip(skip * limit);

    if (limit) {
      query.limit(+limit);
    }

    const results = await query.exec();
    const count = await countQuery.count();
    return { results, count };
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async update(
    userFilterQuery: FilterQuery<UserDocument>,
    user: Partial<User>,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user, {
      new: true,
    });
  }

  async delete(userFilterQuery: FilterQuery<UserDocument>) {
    return this.userModel.deleteOne(userFilterQuery);
  }
}
