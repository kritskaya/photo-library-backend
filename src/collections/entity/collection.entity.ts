import { ApiProperty } from '@nestjs/swagger';

export class CollectionEntity {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty()
  name: string;
}
