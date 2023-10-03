import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.schema';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class ProductCategory {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  products: Product[];
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
