import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumberString,
  Min,
  Max,
} from 'class-validator';

export class createUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly displayName: string;

  @ApiProperty()
  @IsNumberString()
  @Min(10)
  @Max(10)
  @IsString()
  readonly tel: string;

  // @ApiProperty()
  // @IsEmail({}, { message: 'Invalid email format' })
  // @IsNotEmpty()
  // readonly email: string;
}
