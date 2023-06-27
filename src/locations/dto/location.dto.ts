import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @IsInt()
  @IsNotEmpty()
  albumId;

  @IsInt()
  @IsNotEmpty()
  photoId;
}

export class DeleteLocationDto extends CreateLocationDto {}
