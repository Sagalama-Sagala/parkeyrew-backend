import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { getUserDto } from './dto/get-user.dto';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {} // Inject the user service

  @Get()
  async getUsers(): Promise<getUserDto[]> {
    // Fetch users from the service
    const users: any[] = await this.userService.findAll();

    // Map users to getUserDto instances
    const userDtos: getUserDto[] = users.map((user) => ({
      username: user.username,
      displayName: user.displayName,
      tel: user.tel,
      email: user.email,
    }));

    return userDtos;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.findById(id);
  }

  @Post()
  async createUser(
    @Body()
    user: createUserDto,
  ): Promise<User> {
    return this.userService.create(user);
  }
  @Put(':id')
  async updateUser(
    @Param('id')
    id: string,
    @Body()
    user: updateUserDto,
  ): Promise<User> {
    return this.userService.updateById(id, user);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.deleteById(id);
  }
}
