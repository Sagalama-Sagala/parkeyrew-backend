import { ApiProperty } from "@nestjs/swagger";

export class getProfileAccountUser {
  @ApiProperty()
  username: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  profileImage: string;
}