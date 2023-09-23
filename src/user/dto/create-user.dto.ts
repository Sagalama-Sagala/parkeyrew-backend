import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
  @Matches(/^\$2[ayb]\$[\d]{2}\$[./A-Za-z0-9]{53}$/)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  readonly displayName: string;

  @ApiProperty()
  @IsNumberString()
  @Min(10)
  @Max(10)
  @IsString()
  @Matches(/[0-9_-]{10}/)
  readonly tel: string;

  // @ApiProperty()
  // @IsEmail({}, { message: 'Invalid email format' })
  // @IsNotEmpty()
  // readonly email: string;
}
