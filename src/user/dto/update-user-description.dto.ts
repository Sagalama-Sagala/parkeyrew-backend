import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class updateUserDescriptionDto {
  @ApiProperty()
  @IsString()
  description: string;
}
