import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './schemas/room.schema';
import { MessageSchema } from './schemas/message.schema';
import { MessageService } from './service/message/message.service';
import { RoomService } from './service/room-service/room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    AuthModule,
    UserModule,
  ],
  providers: [ChatGateway, RoomService, MessageService],
})
export class ChatModule {}
