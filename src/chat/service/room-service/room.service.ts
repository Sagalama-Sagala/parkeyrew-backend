import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/chat/schemas/room.schema';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private RoomModel: mongoose.Model<Room>,
    private userService: UserService,
  ) {}

  async createRoom(room: Room, creator: User): Promise<Room> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    const createdRoom = await this.RoomModel.create(newRoom);
    await this.userService.addRoomToUser(creator, createdRoom);
    return createdRoom;
  }

  async getRoom(roomId: string): Promise<Room> {
    return this.RoomModel.findById(roomId);
  }

  async getRoomsForUser(user: User): Promise<Room[]> {
    const rooms = await this.RoomModel.find({ users: user });
    console.log(rooms);
    return rooms;
  }

  async addCreatorToRoom(room: Room, creator: User): Promise<Room> {
    room.users.push(creator);
    return room;
  }
}
