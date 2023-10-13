import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class updateUserPasswordDto{
    @ApiProperty()
    readonly oldPassword: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    newPassword: string;
}