import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { UserModule } from 'src/user/user.module';
import { ProductService } from './service/product/product.service';
import { ProductCategoryService } from './service/product-category/product-category.service';
import { ProductCategorySchema } from './schemas/product-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: 'ProductCategory', schema: ProductCategorySchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductCategoryService],
  exports: [ProductService],
})
export class ProductModule {}
