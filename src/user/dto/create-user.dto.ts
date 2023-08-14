import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly displayName: string;

  @ApiProperty()
  @IsString()
  readonly tel: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
