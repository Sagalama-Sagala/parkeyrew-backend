import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../schemas/product.schema';

export class getInfoProductPageDto {
  @ApiProperty()
  product: Product;

  @ApiProperty()
  productsOfUser: Product[];

  @ApiProperty()
  isUserProduct: boolean;
}
