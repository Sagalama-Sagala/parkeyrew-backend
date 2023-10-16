import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Max, Min } from "class-validator";

export class createReviewDto{
    @ApiProperty()
    @IsNotEmpty()
    readonly shop: string;

    @ApiProperty()
    @Min(0)
    @Max(5)
    readonly reviewStar: number;

    @ApiProperty()
    readonly text: string;

    @ApiProperty()
    @IsString()
    readonly historyId: string;
}