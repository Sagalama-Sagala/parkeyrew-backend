import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { Room } from 'src/chat/schemas/room.schema';
import { RoomService } from 'src/chat/service/room-service/room.service';
import { MessageService } from 'src/chat/service/message/message.service';
import { JoinedRoomService } from 'src/chat/service/joined-room/joined-room.service';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { getMessageDto } from '../dto/get-message.dto';

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
    private connectedUserService: ConnectedUserService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
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
        await this.connectedUserService.create({ socketId: socket.id, user });
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnection(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
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
    const alreadyRoom = await this.roomService.findByProduct(room.product);
    if (!alreadyRoom) {
      const newRoom = await this.roomService.createRoom(room, socket.data.user);
      return this.server.to(socket.id).emit('roomId', newRoom._id);
    }
    return this.server.to(socket.id).emit('roomId', alreadyRoom._id);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, roomId: string) {
    const messages = await this.messageService.findMessageForRoom(roomId);
    const room = await this.roomService.findById(roomId);
    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room: room,
    });
    const newMessage: getMessageDto[] = messages.map((message) => ({
      text: message.text,
      createdAt: message.createdAt,
      isMyMessage:
        socket.data.user._id.toString() === message.user._id.toString()
          ? true
          : false,
    }));
    this.server.to(socket.id).emit('messages', newMessage);
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

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: any) {
    const roomId = message.roomId;
    const newMessage = message.message;
    const room: Room = await this.roomService.findById(roomId);
    const createMessage = await this.messageService.create({
      ...newMessage,
      user: socket.data.user,
      room: room,
    });
    console.log(createMessage);
    const joinedUsers = await this.joinedRoomService.findByRoom(room);
    for (const user of joinedUsers) {
      const newMessage: getMessageDto = {
        text: createMessage.text,
        createdAt: createMessage.createdAt,
        isMyMessage:
          socket.data.user._id.toString() === user.user._id.toString()
            ? true
            : false,
      };
      this.server.to(user.socketId).emit('message', newMessage);
    }
  }
}