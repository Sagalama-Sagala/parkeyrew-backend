import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { createUserDto } from './dto/create-user.dto';
import { getUserPageById } from './dto/get-user-page-by-id.dto'
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
  constructor(private readonly userService: UserService,) {}

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
  async getUserById(
    @Req() req: any
  ): Promise<getUserPageById> {
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
  async getShopById(
    @Param('id') id: string
  ): Promise<getUserPageById>{
    return await this.userService.findUserPageById(id);
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
}
