import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class PhotosQueryParams {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  perPage?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  albumId?: number;

  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @IsOptional()
  @IsString()
  officialID?: string;

  @IsOptional()
  @IsString()
  fromGroup?: string;

  @IsOptional()
  @IsString()
  fromPerson?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
