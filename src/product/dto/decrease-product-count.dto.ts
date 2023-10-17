import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class decreaseProductCountDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsString()
  roomId: string;
}
