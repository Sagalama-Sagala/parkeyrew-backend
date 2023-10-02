import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Room } from './room.schema';

@Schema({
  timestamps: true,
})
export class Message {
  @Prop()
  text: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  })
  room: Room;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
