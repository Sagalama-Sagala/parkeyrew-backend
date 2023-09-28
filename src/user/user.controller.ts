import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { createUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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
  @Get('get-user-by-id')
  async getUserById(
    @Req() req: Request,
    @Res() res: Response
  ){
    try{
      //const id = req.user;

    }
    catch(err){
      res.status(500).json({
        message: 'Error to get user by id',
        data: err.message,
      });
    }
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
  ){
    try{
      const username = await this.userService.findByUsername(user.username);
      if(username != null) {
        res.status(400).json({
          message: "Username already in use",
          data: user.username
        });
      }
      else{
        const createdUser = await this.userService.create(user);
        createdUser.password = "";
        res.status(201).json({
          message: "Created user successfully",
          data: createdUser
        });
      }
    }
    catch(err){
      res.status(500).json({
        message: "Error to register",
        data: err.message,
      });
    }
  }
}
