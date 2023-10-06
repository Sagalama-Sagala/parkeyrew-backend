import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/schemas/product.schema';

export class getUserPageById{
    @ApiProperty()
    username: string;

    @ApiProperty()
    reviewStar: number;

    @ApiProperty()
    followerCount: number;

    @ApiProperty()
    followingCount: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    products: Product[];
}