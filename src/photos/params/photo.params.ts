import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class PhotosQueryParams {
  @IsOptional()
  @IsInt()
  perPage?: number;

  @IsOptional()
  @IsInt()
  page?: number;

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
