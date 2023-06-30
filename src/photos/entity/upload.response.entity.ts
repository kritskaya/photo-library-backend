import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseEntity {
  @ApiProperty({ type: [String] })
  urls: string[];
}
