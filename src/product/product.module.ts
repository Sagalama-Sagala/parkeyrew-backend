import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { UserModule } from 'src/user/user.module';
import { ProductService } from './product.service';
import { HistoryModule } from 'src/history/history.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    forwardRef(() => UserModule),
    HistoryModule,
    FileUploadModule,
    ChatModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
