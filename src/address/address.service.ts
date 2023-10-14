import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Address } from "./schemas/address.schema";
import mongoose from "mongoose";
import { createAddressDto } from "./dto/create-address.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AddressService{
    constructor(
        @InjectModel(Address.name)
        private AddressModel: mongoose.Model<Address>,
        private readonly userService: UserService,
    ){};

    async create(userId: string, addressInfo: createAddressDto): Promise<any>{
        try{
            const user = await this.userService.findById(userId);
            const address = await this.AddressModel.create({
                owner: user,
                ...addressInfo
            });
            if(user.mainAddress===undefined || addressInfo.isMainAddress === true){
                const newUser = await this.userService.setMainAddress(address,userId);
                address.owner = newUser;
            }
            return address;
        }
        catch(err){
            throw new HttpException('Error creating address',HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}