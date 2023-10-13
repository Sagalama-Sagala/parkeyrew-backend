import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Address } from "./schemas/address.schema";
import mongoose from "mongoose";

@Injectable()
export class AddressService{
    constructor(
        @InjectModel(Address.name)
        private AddressModel: mongoose.Model<Address>,
    ){};

    async findAll(){
        return this.AddressModel.find();
    }
}