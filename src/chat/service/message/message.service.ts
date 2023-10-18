import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message } from 'src/chat/schemas/message.schema';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private MessageModel: mongoose.Model<Message>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(message: Message, img: BufferedFile): Promise<Message> {
    const ImageUrl = img ? await this.fileUploadService.uploadSingle(img) : null
    message.img = ImageUrl;
    return await this.MessageModel.create(message);
  }

  async findMessageForRoom(roomId: string): Promise<Message[]> {
    const messages = this.MessageModel.find({ room: roomId });
    const messagesSorted = await messages.sort({ createAt: 'desc' }).exec();
    return messagesSorted;
  }

  async findLastOne(roomId: string): Promise<Message> {
    const message = await this.MessageModel.findOne({ room: roomId })
      .sort({
        createdAt: -1,
      })
      .select('text createdAt user otherUserRead')
      .populate({ path: 'user', select: 'username' });
    return message;
  }

  async updateOtherUserRead(roomId: string, user: User): Promise<Message> {
    const message = await this.MessageModel.findOne({
      room: roomId,
      user: { $ne: user },
    }).sort({ createdAt: -1 });
    if (message) {
      message.otherUserRead = true;
      message.save();
    }
    return message;
  }
}
