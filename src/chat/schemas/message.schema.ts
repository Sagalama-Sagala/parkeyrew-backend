import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Message {
  @ApiProperty()
  @Prop()
  text: string;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  })
  room: 'Room';
}

export const MessageSchema = SchemaFactory.createForClass(Message);
