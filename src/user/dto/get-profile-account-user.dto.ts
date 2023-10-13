import { ApiProperty } from "@nestjs/swagger";

export class getProfileAccountUserDto{
    @ApiProperty()
    username: string;

    @ApiProperty()
    firstname: string;

    @ApiProperty()
    lastname: string;

    @ApiProperty()
    phone: string;
}