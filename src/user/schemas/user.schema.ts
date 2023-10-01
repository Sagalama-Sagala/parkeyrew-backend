import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Room } from 'src/chat/schemas/room.schema';
import { Product } from 'src/product/schemas/product.schema';

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty()
  @Prop({ required: true })
  firstname: string;

  @ApiProperty()
  @Prop({ required: true })
  lastname: string;

  @ApiProperty()
  @Prop({ required: true })
  phone: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ default: 0 })
  reviewStar: number;

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    default: [],
  })
  wishList: Product[];

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    default: [],
  })
  followingList: User[];

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    default: [],
  })
  followerList: User[];

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.ObjectId, ref: 'Room' }],
    default: [],
  })
  chatRooms: Room[];
}
export const UserSchema = SchemaFactory.createForClass(User);
