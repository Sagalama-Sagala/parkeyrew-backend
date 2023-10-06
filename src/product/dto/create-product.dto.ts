import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class createProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly deliveryFee: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly brand: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(50)
  @Max(100)
  readonly condition: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly size: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly sendFrom: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly remain: number;
}
