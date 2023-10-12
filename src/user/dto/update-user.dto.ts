import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNumberString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class updateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z]/)
  readonly firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z]/)
  readonly lastname: string;

  @ApiProperty()
  @IsNumberString()
  @IsString()
  @MaxLength(10)
  @Matches(/[0-9]{10}/)
  readonly phone: string;
}
