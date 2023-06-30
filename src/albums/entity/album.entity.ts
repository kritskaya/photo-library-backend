import { ApiProperty } from '@nestjs/swagger';

export class AlbumEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  coverId: number;

  @ApiProperty()
  collcetionId: number;
}
