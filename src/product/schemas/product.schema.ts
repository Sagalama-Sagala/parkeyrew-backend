import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
})
export class Product {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  discription: string;

  @ApiProperty()
  @Prop()
  price: number;

  @ApiProperty()
  @Prop()
  size: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
