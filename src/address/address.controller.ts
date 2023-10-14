import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AddressService } from "./address.service";
import { Address } from "./schemas/address.schema";
import { createAddressDto } from "./dto/create-address.dto";
import { getAddressByUserIdDto } from "./dto/get-address-by-userId.dto";


@ApiTags('Address')
@Controller('address')
export class AddressController{
    constructor(private readonly addressService: AddressService){}

    @ApiOkResponse({
        description: 'Get address by userId successfully',
    })
    @ApiNotFoundResponse({
        description: 'User or address not found',
    })
    @ApiBadRequestResponse({
        description: 'Error while get address',
    })
    @Get('get-address-by-userId')
    async getAddressByUserId(@Req() req:any): Promise<getAddressByUserIdDto>{
        return await this.addressService.getAddressByUserId(req.userId);
    }

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