import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { History } from 'src/history/schema/history.schema';
import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Room {
  _id: mongoose.Types.ObjectId;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  product: Product;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'History',
  })
  history: History;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  seller: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  customer: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    default: [],
  })
  messages: [];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
