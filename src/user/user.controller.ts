import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
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
    return await this.userService.findUserPageById(req.userId);
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
  async getShopById(@Param('id') id: string) {
    return await this.userService.findUserPageById(id);
  }

  @ApiOkResponse({
    description: 'Get profile account successfully',
  })
  @ApiNotFoundResponse({
    description: 'Profile not found',
  })
  @Get('get-profile-account-user')
  async getProfileAccountUser(@Req() req: any): Promise<updateUserDto> {
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
  @Post('edit-user-info')
  async editUserInfo() {}

  @ApiSecurity('JWT-auth')
  @Post('follow-user-by-id')
  async followUserById(@Req() req: any): Promise<any> {
    const result = await this.userService.followUserById(
      req.userId,
      req.body.userId,
    );
    //return await this.userService.followUserById(req.userId, req.body.userId);
    // return { message: 'User followed successfully', result };
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
}
