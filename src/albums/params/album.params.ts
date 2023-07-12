import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class AlbumQueryParams {
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
  collectionId?: number;
}