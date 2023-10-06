import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Room } from './room.schema';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class JoinedRoom {
  @Prop()
  socketId: string;

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

export const JoinedRoomSchema = SchemaFactory.createForClass(JoinedRoom);
