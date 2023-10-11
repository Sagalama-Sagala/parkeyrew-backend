import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
// import { Room } from 'src/chat/schemas/room.schema';
import { Room } from 'src/chat/schemas/room.schema';
import { RoomService } from 'src/chat/service/room-service/room.service';
// import { Message } from 'src/chat/schemas/message.schema';
import { MessageService } from 'src/chat/service/message/message.service';
import { JoinedRoomService } from 'src/chat/service/joined-room/joined-room.service';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private messageService: MessageService,
    private joinedRoomService: JoinedRoomService,
  ) {}

  @SubscribeMessage('message')
  handleChat(@MessageBody() message: string) {
    this.server.emit('message', message);
  }

  async handleConnection(socket: Socket) {
    try {
      console.log('... on connect');
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.userService.findById(decodedToken.id);
      console.log(user.username);

      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user);
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnection(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: Room) {
    const createRoom = await this.roomService.createRoom(
      room,
      socket.data.user,
    );
    return createRoom;
  }

  @SubscribeMessage('connectRoom')
  async onConnectRoom(socket: Socket, room: Room) {
    console.log('hello');
    const alreadyRoom = await this.roomService.findByProduct(room.product);
    if (!alreadyRoom) {
      const newRoom = await this.roomService.createRoom(room, socket.data.user);
      return this.server.to(socket.id).emit('room', newRoom._id);
    }
    return this.server.to(socket.id).emit('room', alreadyRoom._id);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: Room) {
    const messages = await this.messageService.findMessageForRoom(room);
    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('getRoom')
  async onGetRoom(socket: Socket, roomId: string) {
    const room = await this.roomService.getRoom(roomId, socket.data.user);
    this.server.to(socket.id).emit('room', room);
  }

  @SubscribeMessage('getRooms')
  async onGetRooms(socket: Socket) {
    const rooms = await this.roomService.getRoomsForUser(socket.data.user);
    this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  //   @SubscribeMessage('addMessage')
  //   async onAddMessage(socket: Socket, message: Message) {
  //     const createdMessage = await this.messageService.create({
  //       ...message,
  //       user: socket.data.user,
  //     });
  //     const room = await this.roomService.getRoom(
  //       createdMessage.room._id.toString(),
  //     );
  //     const joinedUser = await this.joinedRoomService.findByRoom(room);
  //     for (const user of joinedUser) {
  //       this.server.to(user.socketId).emit('messageAdded', createdMessage);
  //     }
  //   }
}
