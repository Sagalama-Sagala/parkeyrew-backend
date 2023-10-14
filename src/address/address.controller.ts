import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AddressService } from "./address.service";
import { Address } from "./schemas/address.schema";
import { createAddressDto } from "./dto/create-address.dto";
import { getAddressByUserIdDto } from "./dto/get-address-by-userId.dto";
import { updateAddressInfoDto } from "./dto/update-address-info.dto";


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

    @ApiCreatedResponse({
        description: 'Update address successfully',
    })
    @ApiBadRequestResponse({
        description: 'Cannot update address',
    })
    @Post('update-address-info')
    async updateAddressInfo(@Body() addressInfo: updateAddressInfoDto): Promise<Address>{
        return await this.addressService.update(addressInfo);
    }

    @Post('delete-address/:id')
    async delete(@Param('id') id: string): Promise<Address>{
        return await this.addressService.delete(id);
    }
}