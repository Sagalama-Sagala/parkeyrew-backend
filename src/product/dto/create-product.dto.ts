import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class createProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly discription: string;
  @ApiProperty()
  @IsPositive()
  readonly price: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly size: string;
}
