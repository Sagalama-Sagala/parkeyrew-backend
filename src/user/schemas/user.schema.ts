import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';


@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({required: true})
  username: string;

  @ApiProperty()
  @Prop({required: true})
  password: string;

  @ApiProperty()
  @Prop({required: true})
  name: string;

  @ApiProperty()
  @Prop({required: true})
  surname: string;

  @ApiProperty()
  @Prop({required: true})
  phone: string;

  @ApiProperty()
  @Prop({default: 0})
  reviewStar: number;

  @ApiProperty()
  @Prop({type: [{type: mongoose.Schema.ObjectId,ref: "Product"}],default: []})
  wishList: Product[];

  @ApiProperty()
  @Prop({type: [{type: mongoose.Schema.ObjectId,ref: "User"}],default: []})
  followingList: User[];

  @ApiProperty()
  @Prop({type: [{type: mongoose.Schema.ObjectId,ref: "User"}],default: []})
  followerList: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
