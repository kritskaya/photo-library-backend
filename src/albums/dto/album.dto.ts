import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IsIntOrNull } from 'src/common/validation/IntOrNull';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsIntOrNull()
  coverId: number | null;

  @IsOptional()
  @IsIntOrNull()
  collectionId: number | null;
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
