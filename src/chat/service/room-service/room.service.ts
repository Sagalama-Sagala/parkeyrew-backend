import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { getRoomDto } from 'src/chat/dto/get-room.dto';
import { Room } from 'src/chat/schemas/room.schema';
import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';
import { MessageService } from '../message/message.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private RoomModel: mongoose.Model<Room>,
    private messageService: MessageService,
  ) {}

  async createRoom(room: Room, customer: User): Promise<Room> {
    room.customer = customer;
    const createdRoom = await this.RoomModel.create(room);
    return createdRoom;
  }

  async findByProduct(product: Product): Promise<Room> {
    const room = await this.RoomModel.findOne({ product: product });
    return room;
  }

  async findById(roomId: string): Promise<Room> {
    const room = await this.RoomModel.findById(roomId);
    return room;
  }

  async getRoom(roomId: string, user: User): Promise<any> {
    const room = await this.RoomModel.findById(roomId)
      .populate({
        path: 'seller',
        select: 'username',
      })
      .populate({ path: 'customer', select: 'username' })
      .populate({ path: 'product', select: 'name price' });
    const newRoom = new getRoomDto();
    if (user._id.toString() === room.customer._id.toString()) {
      newRoom.user = {
        role: 'customer',
        user: room.customer,
      };
      newRoom.otherUser = {
        role: 'seller',
        user: room.seller,
      };
    } else {
      newRoom.user = {
        role: 'seller',
        user: room.seller,
      };
      newRoom.otherUser = {
        role: 'customer',
        user: room.customer,
      };
    }
    newRoom.id = room._id.toString();
    newRoom.product = room.product;
    newRoom.lastMessage = await this.messageService.findLastOne(
      room._id.toString(),
    );
    return newRoom;
  }

  async getRoomsForUser(user: User): Promise<getRoomDto[]> {
    const rooms = await this.RoomModel.find({
      $or: [{ seller: user }, { customer: user }],
    })
      .populate({
        path: 'seller',
        select: 'username',
      })
      .populate({ path: 'customer', select: 'username' })
      .populate({ path: 'product', select: 'name price' });
    const newRooms: getRoomDto[] = [];
    for (const room of rooms) {
      const newRoom = new getRoomDto();
      if (user._id.toString() === room.customer._id.toString()) {
        newRoom.user = {
          role: 'customer',
          user: room.customer,
        };
        newRoom.otherUser = {
          role: 'seller',
          user: room.seller,
        };
      } else {
        newRoom.user = {
          role: 'seller',
          user: room.seller,
        };
        newRoom.otherUser = {
          role: 'customer',
          user: room.customer,
        };
      }
      newRoom.lastMessage = await this.messageService.findLastOne(
        room._id.toString(),
      );
      newRoom.product = room.product;
      newRoom.id = room._id.toString();
      newRooms.push(newRoom);
    }

    return newRooms;
  }
}
