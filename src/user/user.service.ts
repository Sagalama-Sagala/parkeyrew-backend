import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.UserModel.find();
  }

  async create(user: createUserDto): Promise<User> {
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

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.UserModel.findOne({ username: username }).exec();
      return user;
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updateById(id: string, user: updateUserDto): Promise<User> {
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
    try {
      return await this.UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }
}