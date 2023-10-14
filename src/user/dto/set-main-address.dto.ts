import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class setMainAddressDto {
    @ApiProperty()
    @IsString()
    addressId: string; 
}