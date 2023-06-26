import { IsInt, IsOptional } from 'class-validator';

export class PhotosQueryParams {
  @IsOptional()
  @IsInt()
  perPage?: number;

  @IsOptional()
  @IsInt()
  page?: number;
}
