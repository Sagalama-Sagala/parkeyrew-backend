import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Tag } from './tag.schema';

@Schema({
  timestamps: true,
})
export class Product {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty()
  @Prop({ required: true })
  deliveryFee: number;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  brand: string;

  @ApiProperty()
  @Prop({ required: true })
  color: string;

  @ApiProperty()
  @Prop({ required: true })
  size: string;

  @ApiProperty()
  @Prop({ required: true })
  category: string;

  @ApiProperty()
  @Prop({ required: true })
  sendFrom: string;

  @ApiProperty()
  @Prop({ required: true })
  remain: number;

  @ApiProperty()
  @Prop({ default: 0 })
  viewCount: number;

  @ApiProperty()
  @Prop({ default: 0 })
  likeCount: number;

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tags' }],
    default: [],
  })
  tags: Tag[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
