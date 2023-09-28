import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';

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
  @UseGuards(JwtAuthGuard)
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
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
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
  @Post('register')
  async register(
    @Body()
    user: createUserDto,
    @Res()
    res: Response,
  ): Promise<User> {
    try{
      const username = await this.userService.findByUsername(user.username);
      if(username != null) {
        throw new HttpException("Username already in use",400)
      }
      else{
        return await this.userService.create(user);
      }
    }
    catch(err){
      res.status(500).json({
        message: "Error to register",
        data: err.message,
      });
    }
  }

  @ApiCreatedResponse({
    description: 'Updated user object as response',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Invalid user ID, Try again',
  })
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
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
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.deleteById(id);
  }
}
