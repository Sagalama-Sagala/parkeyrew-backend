import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/schemas/product.schema';
import { User } from '../schemas/user.schema';

export class getUserPageById {
  @ApiProperty()
  username: string;

  @ApiProperty()
  reviewStar: number;

  @ApiProperty()
  follower: User[];

  @ApiProperty()
  following: User[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  products: Product[];
}
