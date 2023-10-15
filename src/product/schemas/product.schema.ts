import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Max, Min } from 'class-validator';

@Schema({
  timestamps: true,
})
export class Product {
  _id: mongoose.Types.ObjectId;

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
  @Min(50)
  @Max(100)
  condition: number;

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
  @Prop({ default: [] })
  productImage: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
