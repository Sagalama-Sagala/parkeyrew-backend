import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumberString, IsString, Matches, MaxLength } from 'class-validator';

export class createAddressDto{
    

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly firstname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly lastname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly addressDescription: string;

    @ApiProperty()
    @IsNumberString()
    @IsString()
    @MaxLength(10)
    @Matches(/[0-9]{10}/)
    readonly phone: string;

    @ApiProperty()
    @IsBoolean()
    readonly isMainAddress: boolean;
}