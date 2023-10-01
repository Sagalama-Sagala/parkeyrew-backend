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

  async createRoom(room: Room, creator: User): Promise<Room> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.RoomModel.create(newRoom);
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.RoomModel.findById(roomId);
  }

  async getRoomsForUser(userId: string): Promise<Room[]> {
    const rooms = await this.RoomModel.find({ 'users._id': userId });
    return rooms;
  }

  async addCreatorToRoom(room: Room, creator: User): Promise<Room> {
    room.users.push(creator);
    return room;
  }
}
