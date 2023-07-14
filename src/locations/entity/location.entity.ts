import { ApiProperty } from "@nestjs/swagger";

export class LocationEntity {
  @ApiProperty({ type: Number })
  id;

  @ApiProperty({ type: Number })
  albumId;

  @ApiProperty({ type: Number })
  photoId;
}
