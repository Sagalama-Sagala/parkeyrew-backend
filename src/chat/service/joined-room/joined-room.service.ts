import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { JoinedRoom } from 'src/chat/schemas/joined-room.schema';
import { Room } from 'src/chat/schemas/room.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectModel(JoinedRoom.name)
    private JoinedRoomModel: mongoose.Model<JoinedRoom>,
  ) {}

  async create(joinedRoom: JoinedRoom): Promise<JoinedRoom> {
    return this.JoinedRoomModel.create(joinedRoom);
  }

  async findByUser(user: User): Promise<JoinedRoom[]> {
    return this.JoinedRoomModel.find({ user: user });
  }

  async findByRoom(room: Room): Promise<JoinedRoom[]> {
    return this.JoinedRoomModel.find({ room: room });
  }

  async deleteBySocketId(socketId: string) {
    return this.JoinedRoomModel.deleteMany({ socketId: socketId });
  }

  async deleteAll() {
    return this.JoinedRoomModel.deleteMany();
  }
}
