import { ApiProperty } from '@nestjs/swagger';

export class PhotoEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  path: string;

  @ApiProperty({ example: '2023-06-26T13:08:16.833Z' })
  uploadedAt: string;

  @ApiProperty({ example: '2023-06-26T13:08:16.833Z' })
  receivedAt: string;

  @ApiProperty({ example: 'BY-1234567' })
  officialID: string;

  @ApiProperty()
  fromGroup: string;

  @ApiProperty()
  fromPerson: string;

  @ApiProperty()
  description: string;
}
