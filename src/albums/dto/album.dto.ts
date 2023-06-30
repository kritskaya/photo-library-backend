import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsIntOrNull } from 'src/common/validation/IntOrNull';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIntOrNull()
  coverId: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIntOrNull()
  collectionId: number | null;
}

// there is a problem with OpenApi with using [class extends PartialType]

export class UpdateAlbumDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIntOrNull()
  coverId: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIntOrNull()
  collectionId: number | null;
}
