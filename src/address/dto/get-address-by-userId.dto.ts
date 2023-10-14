import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../schemas/address.schema";

export class getAddressByUserIdDto {

    @ApiProperty()
    mainAddress: Address;

    @ApiProperty()
    Addresses: Address[];
}