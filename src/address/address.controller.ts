import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { AddressService } from "./address.service";
import { Address } from "./schemas/address.schema";
import { createAddressDto } from "./dto/create-address.dto";

@ApiTags('Address')
@Controller('address')
export class AddressController{
    constructor(private readonly addressService: AddressService){}

    @ApiCreatedResponse({
        description: 'Create new address successfully',
        type: Address,
    })
    @ApiBadRequestResponse({
        description: 'Cannot create address',
    })
    @Post('create-address')
    async createAddress(@Req() req: any, @Body() addressInfo: createAddressDto): Promise<Address>{
        const result =  await this.addressService.create(req.userId, addressInfo);
        result.owner.password = "";
        return result;
    }
}