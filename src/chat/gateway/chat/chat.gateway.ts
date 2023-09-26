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

  title: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'test socket';
  }

  @SubscribeMessage('chat')
  handleChat(@MessageBody() message: string) {
    this.server.emit('chat', message);
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.userService.findById(decodedToken.id);

      if (!user) {
        return this.disconnect(socket);
      } else {
        this.title.push('value ' + Math.random().toString());
        this.server.emit('message', this.title);
      }
    } catch {
      return this.disconnect(socket);
    }
    console.log('On connect');
  }

  handleDisconnection(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
