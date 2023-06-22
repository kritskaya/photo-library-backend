import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCollectionDto extends CreateCollectionDto {}
