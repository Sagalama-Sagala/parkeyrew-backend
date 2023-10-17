import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { updateUserPasswordDto } from './dto/update-user-password.dto';
import { setMainAddressDto } from './dto/set-main-address.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { getProfileAccountUser } from './dto/get-profile-account-user.dto';
import { updateUserDescriptionDto } from './dto/update-user-description.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'Get user objects as response',
    type: User,
    isArray: true,
  })
  @ApiSecurity('JWT-auth')
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOkResponse({
    description: 'Get user successfully',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiSecurity('JWT-auth')
  @Get('get-user-page-by-id')
  async getUserById(@Req() req: any) {
    console.log('req', req.userId);
    return await this.userService.findUserPageById(req.userId, req.userId);
  }

  @ApiOkResponse({
    description: 'Get user successfully',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiSecurity('JWT-auth')
  @Get('get-shop-page-by-id/:id')
  async getShopById(@Req() req: any, @Param('id') id: string) {
    return await this.userService.findUserPageById(id, req.userId);
  }

  @ApiOkResponse({
    description: 'Get profile account successfully',
  })
  @ApiNotFoundResponse({
    description: 'Profile not found',
  })
  @Get('get-profile-account-user')
  @ApiSecurity('JWT-auth')
  async getProfileAccountUser(@Req() req: any): Promise<getProfileAccountUser> {
    return await this.userService.getProfileAccountUser(req.userId);
  }

  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'User cannot register. Try again',
  })
  @Post('register')
  async register(
    @Body()
    user: createUserDto,
  ): Promise<createUserDto> {
    return await this.userService.register(user);
  }

  @ApiOkResponse({
    description: 'Edit user info successfully',
  })
  @ApiBadRequestResponse({
    description: 'Cannot edit user info',
  })

  @ApiSecurity('JWT-auth')
  @Post('follow-user-by-id')
  async followUserById(@Req() req: any): Promise<any> {
    const result = await this.userService.followUserById(
      req.userId,
      req.body.userId,
    );
    if (!result) {
      throw new NotFoundException('User not found or already followed.');
    }
    return { message: 'User followed successfully' };
  }

  @ApiSecurity('JWT-auth')
  @Post('unfollow-user-by-id')
  async unfollowUserById(@Req() req: any): Promise<any> {
    const result = await this.userService.unfollowUserById(
      req.userId,
      req.body.userId,
    );

    if (!result) {
      throw new NotFoundException('User not found or not currently followed.');
    }

    return { message: 'User unfollowed successfully' };
  }
  
  @Put('edit-user-info')
  async editUserInfo(
    @Req() req: any,
    @Body() userInfo: updateUserDto,
  ): Promise<updateUserDto> {
    return await this.userService.updateById(req.userId, userInfo);
  }

  @ApiSecurity('JWT-auth')
  @Put('edit-user-description')
  async editUserDescription(
    @Req() req: any,
    @Body() userDescription: updateUserDescriptionDto,
  ): Promise<User> {
    return await this.userService.updateUserDescription(
      req.userId,
      userDescription.description,
    );
  }

  @ApiOkResponse({
    description: 'Edit user password successfully',
  })
  @ApiBadRequestResponse({
    description: 'Cannot edit user password',
  })
  @Put('edit-user-password')
  @ApiSecurity('JWT-auth')
  async editUserPassword(
    @Req() req: any,
    @Body() passwordInfo: updateUserPasswordDto,
  ): Promise<any> {
    return await this.userService.updatePasswordById(req.userId, passwordInfo);
  }

  @ApiOkResponse({
    description: 'Set main address successfully',
  })
  @ApiBadRequestResponse({
    description: 'Cannot set main address',
  })
  @Post('set-main-address')
  async setMainAddress(
    @Req() req: any,
    @Body() address: setMainAddressDto,
  ): Promise<any> {
    return await this.userService.setMainAddress(address.addressId, req.userId);
  }

  @ApiOkResponse({
    description: 'Create wish list response as object',
  })
  @ApiBadRequestResponse({
    description: 'Not found user',
  })
  @ApiSecurity('JWT-auth')
  @Get('get-user-wishlist')
  async getUserWishlist(@Req() req: any): Promise<User> {
    const result = this.userService.findUserWishList(req.userId);
    return result;
  }

  @ApiOkResponse({
    description: 'Add product to wishlist successfully',
  })
  @ApiBadRequestResponse({
    description: 'Can not add product to wishlist, try again.',
  })
  @ApiSecurity('JWT-auth')
  @Put('add-user-wishlist/:productId')
  async toggleUserWishlist(
    @Req() req: any,
    @Param('productId') produtcId: string,
  ): Promise<User> {
    console.log(req.userId);
    const result = this.userService.toggleWishList(req.userId, produtcId);
    return result;
  }

  @ApiOkResponse({
    description: 'add image successfully',
  })
  @ApiBadRequestResponse({
    description: 'add image fail try again',
  })
  @ApiSecurity('JWT-auth')
  @UseInterceptors(FileInterceptor('image'))
  @Put('edit-profile-image')
  async editProfileImage(
    @Req() req: any,
    @UploadedFile() image: BufferedFile,
  ): Promise<User> {
    const user = this.userService.editImageUrl(req.userId, image);
    return user;
  }
}
