import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  name: string;

  @Prop()
  discription: string;

  @Prop()
  price: number;

  @Prop()
  size: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
