import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";
import { User } from "src/user/schemas/user.schema";

@Schema({
    timestamps: true,
})
export class Address {
    _id: mongoose.Types.ObjectId;

    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User;

    @ApiProperty()
    @Prop({ required: true })
    firstname: string;

    @ApiProperty()
    @Prop({ required: true })
    lastname: string;

    @ApiProperty()
    @Prop({ required: true })
    address: string;

    @ApiProperty()
    @Prop({ required: true })
    addressDescription: string;

    @ApiProperty()
    @Prop({ required: true })
    phone: string;
}
export const AddressSchema = SchemaFactory.createForClass(Address);