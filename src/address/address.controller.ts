import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AddressService } from "./address.service";

@ApiTags('Address')
@Controller('address')
export class AddressController{
    constructor(private readonly addressService: AddressService){}

    @Get()
    async get(){
        return await this.addressService.findAll();
    }
}