import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class createUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  readonly username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  readonly displayName: string;

  @ApiProperty()
  @IsNumberString()
  @IsString()
  @Matches(/[0-9_-]{10}/)
  readonly tel: string;
}
//
