import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Room {
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  users: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    default: [],
  })
  messages: [];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
