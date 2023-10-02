import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { UserModule } from 'src/user/user.module';
import { TagSchema } from './schemas/tag.schema';
import { TagService } from './service/tag/tag.service';
import { ProductService } from './service/product/product.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, TagService],
  exports: [ProductService],
})
export class ProductModule {}
