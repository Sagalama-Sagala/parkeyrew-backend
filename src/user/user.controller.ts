import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiCreatedResponse({
    description: 'Get user object as response',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Invalid user ID, Try again',
  })
  @Get(':id')
  async getUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.findById(id);
  }

  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'User cannot register. Try again',
  })
  @Post()
  async createUser(
    @Body()
    user: createUserDto,
  ): Promise<User> {
    return this.userService.create(user);
  }

  @ApiCreatedResponse({
    description: 'Updated user object as response',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Invalid user ID, Try again',
  })
  @Put(':id')
  async updateUser(
    @Param('id')
    id: string,
    @Body()
    user: updateUserDto,
  ): Promise<User> {
    return this.userService.updateById(id, user);
  }

  @ApiNotFoundResponse({
    description: 'Invalid user ID, Try again',
  })
  @ApiOkResponse({
    description: 'Delete OK.',
  })
  @Delete(':id')
  async deleteUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.deleteById(id);
  }
}
