import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class updateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\$2[ayb]\$[\d]{2}\$[./A-Za-z0-9]{53}$/)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  readonly displayName: string;

  @ApiProperty()
  @IsString()
  @Matches(/[0-9_-]{10}/)
  readonly tel: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
