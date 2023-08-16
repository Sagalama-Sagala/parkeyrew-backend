import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop()
  displayName: string;

  @ApiProperty()
  @Prop()
  tel: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
