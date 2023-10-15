import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ReviewModule } from './review/review.module';
import { AddressModule } from './address/address.module';
import { HistoryModule } from './history/history.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MinioClientModule } from './minio-client/minio-client.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    ProductModule,
    AuthModule,
    ChatModule,
    ReviewModule,
    AddressModule,
    HistoryModule,
    FileUploadModule,
    MinioClientModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/user/register',
          method: RequestMethod.POST,
        },
        {
          path: '/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: '/product',
          method: RequestMethod.GET,
        },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
//kuay
