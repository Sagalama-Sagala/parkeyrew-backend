import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { getRoomDto } from 'src/chat/dto/get-room.dto';
import { Room } from 'src/chat/schemas/room.schema';
import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';
import { MessageService } from '../message/message.service';
import { History } from 'src/history/schema/history.schema';

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

  async findByAlreadyRoom(
    product: Product,
    seller: User,
    customer: User,
  ): Promise<Room> {
    const room = await this.RoomModel.findOne({
      product: product,
      seller: seller,
      customer: customer,
    });
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
        select: 'username profileImage',
      })
      .populate({
        path: 'customer',
        select: 'username profileImage mainAddress',
      })
      .populate({ path: 'product', select: 'name price productImage' })
      .populate('history');
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
      newRoom.history = room.history;
      newRoom.product = room.product;
      newRoom.id = room._id.toString();
      newRooms.push(newRoom);
    }

    return newRooms;
  }

  async getRoomSellerForUsers(user: User): Promise<getRoomDto[]> {
    const rooms = await this.RoomModel.find({ customer: user })
      .populate({
        path: 'seller',
        select: 'username',
      })
      .populate({ path: 'customer', select: 'username' })
      .populate({ path: 'product', select: 'name price' });
    const newRooms: getRoomDto[] = [];
    for (const room of rooms) {
      const newRoom = new getRoomDto();
      newRoom.user = {
        role: 'customer',
        user: room.customer,
      };
      newRoom.otherUser = {
        role: 'seller',
        user: room.seller,
      };
      newRoom.lastMessage = await this.messageService.findLastOne(
        room._id.toString(),
      );
      newRoom.product = room.product;
      newRoom.id = room._id.toString();
      newRooms.push(newRoom);
    }
    return newRooms;
  }

  async getRoomCustomerForUsers(user: User): Promise<getRoomDto[]> {
    const rooms = await this.RoomModel.find({ seller: user })
      .populate({
        path: 'customer',
        select: 'username',
      })
      .populate({ path: 'customer', select: 'username' })
      .populate({ path: 'product', select: 'name price' });
    const newRooms: getRoomDto[] = [];
    for (const room of rooms) {
      const newRoom = new getRoomDto();
      newRoom.user = {
        role: 'seller',
        user: room.seller,
      };
      newRoom.otherUser = {
        role: 'customer',
        user: room.customer,
      };
      newRoom.lastMessage = await this.messageService.findLastOne(
        room._id.toString(),
      );
      newRoom.product = room.product;
      newRoom.id = room._id.toString();
      newRooms.push(newRoom);
    }
    return newRooms;
  }

  async updateHistory(roomId: string, history: History): Promise<Room> {
    try {
      const updatedRoom = await this.RoomModel.findByIdAndUpdate(
        roomId,
        {
          $set: { history: history },
        },
        { new: true, runValidators: true },
      );
      return updatedRoom;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
