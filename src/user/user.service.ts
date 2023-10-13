import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { ProductService } from '../product/product.service';
import mongoose from 'mongoose';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { getUserPageById } from './dto/get-user-page-by-id.dto';
import * as bcrypt from 'bcrypt';
import { Room } from 'src/chat/schemas/room.schema';
import { updateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<User>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.UserModel.find();
  }

  async findUserPageById(userId: string){
    try{
      const user = await this.UserModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found',HttpStatus.NOT_FOUND);
      }
      const products = await this.productService.findAllByOwnerId(userId);
      const result = new getUserPageById(); 
      result.username = user.username;
      result.reviewStar = user.reviewStar;
      result.followerCount = user.followerList.length;
      result.followingCount = user.followingList.length;
      result.description = user.description;
      result.products = products;
      return result;
    } catch (err) {
      throw new HttpException('Error to get user by id',HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    const user = await this.UserModel.findOne({ username: username }).exec();
    return user;
  }

  async getProfileAccountUser(userId: string): Promise<updateUserDto> {
    try{
      const user = await this.UserModel.findById(userId);
      if(!user){
        throw new HttpException('User not found: '+userId,HttpStatus.NOT_FOUND);
      }
      const result = new updateUserDto();
      result.username = user.username;
      result.firstname = user.firstname;
      result.lastname = user.lastname;
      result.phone = user.phone;
      return result;
    }catch(err){
      throw new HttpException('Error to get profile account page: '+err.message,HttpStatus.INTERNAL_SERVER_ERROR);
    } 
  }
  
  async create(user: createUserDto): Promise<User> {
    try {
      
      const createdUser = await this.UserModel.create(user);
      return createdUser;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async register(user: createUserDto): Promise<createUserDto> {
    try {
      const username = await this.UserModel.findOne({username: user.username});
      if (username != null) {
        throw new HttpException('Username already in use : '+user.username,HttpStatus.BAD_REQUEST,);
      } else {
        const password = await bcrypt.hash(user.password, 10);
        user.password = password;
        const createdUser = await this.UserModel.create(user);
        createdUser.password = "";
        return createdUser;
      }
    } catch (err) {
      throw new HttpException('Error to register : '+err.message, 500);
    }
  }
  
  async updateById(id: string, userInfo: updateUserDto): Promise<updateUserDto> {
    try{
      const user = await this.UserModel.findOne({ _id: { $ne: id }, username: userInfo.username });
      if(user){
        throw new HttpException('',HttpStatus.BAD_REQUEST);
      }
    }
    catch (err) {
      throw new HttpException('This username is already exist: '+userInfo.username,HttpStatus.BAD_REQUEST);
    }
    try {
      await this.UserModel.findOneAndUpdate(
        { _id: id }, 
        { $set: userInfo }, 
        { new: true, runValidators: true, }
      );
      return userInfo;
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updatePasswordById(userId: string, passwordInfo: updateUserPasswordDto): Promise<any>{
    try{  
      const user = await this.UserModel.findById(userId);
      if(!user){
        return { message:'User not found: '+userId, status: HttpStatus.NOT_FOUND};
      }
      const isMatch = await bcrypt.compare(passwordInfo.oldPassword, user.password);
      if(!isMatch){
        return { message:'Old password is not correct', status: HttpStatus.BAD_REQUEST};
      }
      const hashPassword = await bcrypt.hash(passwordInfo.newPassword,10);
      await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: { password: hashPassword } },
        { new: true, runValidators: true },
      );
      return { message: 'Update password successfully', status: HttpStatus.OK};
    }
    catch(err){
      throw new HttpException('Error to reset password: '+err.message,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateReviewStar(userId: string, star: number): Promise<User>{
    try{
      const user = await this.UserModel.findById(userId);
      if(!user){
        throw new HttpException('User not found: ' + userId,404);
      }
      const newStar = (user.reviewStar === -1) ? star : ((user.reviewStar * user.reviewCount) + star)/(user.reviewCount+1);
      return await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: 
          { reviewStar: newStar, reviewCount: user.reviewCount+1 }
        },
        { new: true, runValidators: true },
      );
    }catch(err){
      throw new HttpException('Error to update review star: '+err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteById(id: string): Promise<User> {
    try {
      return await this.UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  // for chat service
  async addRoomToUser(user: User, room: Room): Promise<User> {
    const newUser = await this.UserModel.findByIdAndUpdate(user._id, {
      $push: { chatRooms: room._id },
    });
    return newUser;
  }
}
