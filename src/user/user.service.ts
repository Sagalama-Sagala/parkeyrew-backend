import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.UserModel.find();
    return users;
  }

  async create(user: User): Promise<User> {
    const res = await this.UserModel.create(user);
    return res;
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.UserModel.findById(id);
      return user;
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updateById(id: string, user: User): Promise<User> {
    try {
      return await this.UserModel.findOneAndUpdate({ _id: id }, user, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }
  async deleteById(id: string): Promise<User> {
    return await this.UserModel.findByIdAndDelete(id);
  }
}
