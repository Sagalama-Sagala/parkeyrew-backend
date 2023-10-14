import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";
import { Product } from "src/product/schemas/product.schema";
import { User } from "src/user/schemas/user.schema";

@Schema({
    timestamps: true,
})
export class History {
    _id: mongoose.Types.ObjectId;

    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
    product: Product;

    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    shop: User;

    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    customer: User;

    @ApiProperty()
    @Prop({ default: "waiting" })
    status: string;
}
export const HistorySchema = SchemaFactory.createForClass(History);