import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, Min, Max } from 'class-validator';
import { BufferedFile } from 'src/minio-client/file.model';

export class updateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly productId: string;

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
