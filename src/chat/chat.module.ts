import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './schemas/room.schema';
import { MessageSchema } from './schemas/message.schema';
import { MessageService } from './service/message/message.service';
import { RoomService } from './service/room-service/room.service';
import { JoinedRoomSchema } from './schemas/joined-room.schema';
import { ConnectedUserSchema } from './schemas/connected-user.schema';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { JoinedRoomService } from './service/joined-room/joined-room.service';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: 'JoinedRoom', schema: JoinedRoomSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'ConnectedUser', schema: ConnectedUserSchema },
    ]),
    AuthModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    ChatGateway,
    RoomService,
    MessageService,
    ConnectedUserService,
    JoinedRoomService,
  ],
  exports: [RoomService],
})
export class ChatModule {}
