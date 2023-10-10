import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/chat/schemas/room.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private RoomModel: mongoose.Model<Room>,
  ) {}

  async createRoom(room: Room, customer: User): Promise<Room> {
    room.customer = customer;
    const createdRoom = await this.RoomModel.create(room);
    return createdRoom;
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.RoomModel.findById(roomId);
  }

  async getRoomsForUser(user: User): Promise<Room[]> {
    const rooms = await this.RoomModel.find({
      $or: [{ seller: user }, { customer: user }],
    })
      .populate('seller')
      .populate('customer');
    console.log(rooms);
    return rooms;
  }
}
