import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ConnectedUser } from 'src/chat/schemas/connected-user.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectModel(ConnectedUser.name)
    private ConnectedUserModel: mongoose.Model<ConnectedUser>,
  ) {}

  async create(connectedUser: ConnectedUser): Promise<ConnectedUser> {
    return this.ConnectedUserModel.create(connectedUser);
  }

  async findByUser(user: User): Promise<ConnectedUser[]> {
    return this.ConnectedUserModel.find({ user: user });
  }

  async deleteBySocketId(socketId: string) {
    return this.ConnectedUserModel.deleteMany({ socketId: socketId });
  }

  async deleteAll() {
    await this.ConnectedUserModel.deleteMany();
  }
}
