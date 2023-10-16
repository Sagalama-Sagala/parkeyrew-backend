import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
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
import { AddressService } from 'src/address/address.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { getProfileAccountUser } from './dto/get-profile-account-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<User>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.UserModel.find();
  }

  async findUserPageById(shopId: string,userId: string) {
    try {
      const shop = await this.UserModel.findById(shopId).populate({
        path: 'followerList followingList',
        select: 'username profileImage',
      });
      const user = await this.UserModel.findById(userId).populate({
        path: 'followerList followingList',
        select: 'username profileImage',
      });
      if (!shop) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      const products = await this.productService.findAllByOwnerId(shopId);
      const result = new getUserPageById();
      result.username = shop.username;
      result.reviewStar = shop.reviewStar;
      result.profileImage = shop.profileImage;
      result.follower = shop.followerList;
      result.following = shop.followingList;
      result.description = shop.description;
      result.products = products;
      result.isFollow = shop.followerList.includes(user);
      result.followerStatus = [];
      result.followingStatus = [];
      for(let i=0; i<shop.followerList.length; i++) {
        if(shop.followerList[i]._id.toString() === userId){
          result.followerStatus.push("it's me");
        }
        else if(user.followingList.includes(shop.followerList[i])){
          result.followerStatus.push("following");
        }
        else{
          result.followerStatus.push("not following");
        }
      }
      for(let i=0; i<shop.followingList.length; i++) {
        if(shop.followingList[i]._id.toString() === userId){
          result.followingStatus.push("it's me");
        }
        else if(user.followingList.includes(shop.followingList[i])){
          result.followingStatus.push("following");
        }
        else{
          result.followingStatus.push("not following");
        }
      }
      return result;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status,
      );
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

  async getProfileAccountUser(userId: string): Promise<getProfileAccountUser> {
    try {
      const user = await this.UserModel.findById(userId);
      if (!user) {
        throw new HttpException(
          'User not found: ' + userId,
          HttpStatus.NOT_FOUND,
        );
      }
      const result = new getProfileAccountUser();
      result.username = user.username;
      result.firstname = user.firstname;
      result.lastname = user.lastname;
      result.phone = user.phone;
      result.profileImage = user.profileImage;
      return result;
    } catch (err) {
      throw new HttpException(
        'Error to get profile account page: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      const username = await this.UserModel.findOne({
        username: user.username,
      });
      if (username != null) {
        throw new HttpException(
          'Username already in use : ' + user.username,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const password = await bcrypt.hash(user.password, 10);
        user.password = password;
        const createdUser = await this.UserModel.create(user);
        createdUser.password = '';
        return createdUser;
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async updateById(
    id: string,
    userInfo: updateUserDto,
  ): Promise<updateUserDto> {
    try {
      const user = await this.UserModel.findOne({
        _id: { $ne: id },
        username: userInfo.username,
      });
      if (user) {
        throw new HttpException('', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(
        'This username is already exist: ' + userInfo.username,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.UserModel.findOneAndUpdate(
        { _id: id },
        { $set: userInfo },
        { new: true, runValidators: true },
      );
      return userInfo;
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async updatePasswordById(
    userId: string,
    passwordInfo: updateUserPasswordDto,
  ): Promise<any> {
    try {
      const user = await this.UserModel.findById(userId);
      if (!user) {
        return {
          message: 'User not found: ' + userId,
          status: HttpStatus.NOT_FOUND,
        };
      }
      const isMatch = await bcrypt.compare(
        passwordInfo.oldPassword,
        user.password,
      );
      if (!isMatch) {
        return {
          message: 'Old password is not correct',
          status: HttpStatus.BAD_REQUEST,
        };
      }
      const hashPassword = await bcrypt.hash(passwordInfo.newPassword, 10);
      await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: { password: hashPassword } },
        { new: true, runValidators: true },
      );
      return { message: 'Update password successfully', status: HttpStatus.OK };
    } catch (err) {
      throw new HttpException(
        'Error to reset password: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateReviewStar(userId: string, star: number): Promise<User> {
    try {
      const user = await this.UserModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found: ' + userId, 404);
      }
      const newStar =
        user.reviewStar === -1
          ? star
          : (user.reviewStar * user.reviewCount + star) /
            (user.reviewCount + 1);
      return await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: { reviewStar: newStar, reviewCount: user.reviewCount + 1 } },
        { new: true, runValidators: true },
      );
    } catch (err) {
      throw new HttpException(
        'Error to update review star: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setMainAddress(addressId: string, userId: string): Promise<any> {
    try {
      const address = await this.addressService.findById(addressId);
      if (!address) {
        throw new HttpException('Address not found', 404);
      }
      if (address.owner._id.toString() != userId) {
        throw new HttpException(
          'This address is not owned by this user: ' + userId,
          400,
        );
      }
      return await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: { mainAddress: address } },
        { new: true, runValidators: true },
      );
    } catch (err) {
      throw new HttpException(
        'Error to set main address: ' + err.message,
        err.status,
      );
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
  async followUserById(userId: string, followUserId: string) {
    if (userId === followUserId) {
      return false; // You can't follow yourself
    }

    const user = await this.UserModel.findById(userId);
    const followUser = await this.UserModel.findById(followUserId);

    if (!user || !followUser) {
      return false; // User or followUser not found
    }

    // Update the 'following' list of the current user
    user.followingList.push(followUser);
    await user.save();

    // Update the 'followers' list of the user being followed
    followUser.followerList.push(user);
    await followUser.save();

    return true;
  }

  async unfollowUserById(userId: string, followUserId: string) {
    const user = await this.UserModel.findById(userId);
    const followUser = await this.UserModel.findById(followUserId);

    if (!user || !followUser) {
      return false; // User or followUser not found
    }

    // Remove followUserId from the 'following' list of the current user
    user.followingList = user.followingList.filter((id) => id !== followUser);
    await user.save();

    // Remove userId from the 'followers' list of the user being unfollowed
    followUser.followerList = followUser.followerList.filter(
      (id) => id !== user,
    );
    await followUser.save();

    return true;
  }

  async toggleWishList(userId: string, productId: string): Promise<User> {
    const user = await this.UserModel.findById(userId);
    const product = await this.productService.findById(productId);
    const productIndex = user.wishList.findIndex(
      (item) => item._id.toString() === product._id.toString(),
    );
    if (productIndex === -1) {
      user.wishList.push(product);
    } else {
      user.wishList.splice(productIndex, 1);
    }
    await user.save();
    return user;
  }

  async findUserWishList(userId: string): Promise<User> {
    const user = this.UserModel.findById(userId)
      .select('wishList')
      .populate({
        path: 'wishList',
        populate: { path: 'owner', select: 'username reviewStar profileImage' },
      });
    return user;
  }

  async updateUserDescription(
    userId: string,
    description: string,
  ): Promise<User> {
    const user = await this.UserModel.findById(userId);
    user.description = description;
    await user.save();
    return user;
  }

  async editImageUrl(userId: string, image: BufferedFile): Promise<User> {
    const user = await this.UserModel.findById(userId);
    const imageUrl = await this.fileUploadService.uploadSingle(image);
    user.profileImage = imageUrl;
    await user.save();
    return user;
  }
}
