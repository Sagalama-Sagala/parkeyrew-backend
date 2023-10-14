import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Address } from "./schemas/address.schema";
import mongoose from "mongoose";
import { createAddressDto } from "./dto/create-address.dto";
import { UserService } from "src/user/user.service";
import { getAddressByUserIdDto } from "./dto/get-address-by-userId.dto";
import { updateAddressInfoDto } from "./dto/update-address-info.dto";

@Injectable()
export class AddressService{
    constructor(
        @InjectModel(Address.name)
        private AddressModel: mongoose.Model<Address>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ){};

    async findById(addressId: string): Promise<Address>{
        return this.AddressModel.findById(addressId);
    }

    async getAddressByUserId(userId: string): Promise<getAddressByUserIdDto>{
        try{
            const user = await this.userService.findById(userId);
            if(!user){
                throw new HttpException('User Not Found',404);
            }
            const result = new getAddressByUserIdDto();
            if(user.mainAddress===undefined){
                return result
            }
            result.mainAddress = await this.AddressModel.findById(user.mainAddress);
            result.Addresses = await this.AddressModel.find({ _id: { $ne: user.mainAddress }, owner: userId});
            return result
        }
        catch(err){
            throw new HttpException('Error while getting address: '+err.message, err.status);
        }
    }

    async create(userId: string, addressInfo: createAddressDto): Promise<any>{
        try{
            const user = await this.userService.findById(userId);
            const address = await this.AddressModel.create({
                owner: user,
                ...addressInfo
            });
            if(user.mainAddress===undefined || addressInfo.isMainAddress === true){
                const newUser = await this.userService.setMainAddress(address._id.toString(),userId);
                address.owner = newUser;
            }
            return address;
        }
        catch(err){
            throw new HttpException('Error creating address',HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(addressInfo: updateAddressInfoDto): Promise<Address>{
        try{
            return await this.AddressModel.findOneAndUpdate(
                { _id: addressInfo.addressId },
                { $set: addressInfo },
                { new: true, runValidators:true },
            );
        }
        catch(err){
            throw new HttpException('Error updating address: '+err.message,err.status);
        }
    }

    async delete(id: string): Promise<Address> {
        try {
            const address = await this.AddressModel.findById(id).populate("owner");
            if(!address){
                throw new HttpException('Address not found: '+id,404);
            }
            if(address.owner.mainAddress._id.toString() === id){
                throw new HttpException('Cannot delete main address: '+id,400);
            }
            return await this.AddressModel.findByIdAndDelete(id);
        } catch (error) {
            throw new HttpException('Address not found.', HttpStatus.NOT_FOUND);
        }
    } 
}