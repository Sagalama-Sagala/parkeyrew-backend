import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message } from 'src/chat/schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private MessageModel: mongoose.Model<Message>,
  ) {}

  async create(message: Message): Promise<Message> {
    return this.MessageModel.create(message);
  }

  async findMessageForRoom(roomId: string) {
    const messages = this.MessageModel.find({ room: roomId });
    const messagesSorted = await messages.sort({ createAt: 'desc' }).exec();
    return messagesSorted;
  }
}
