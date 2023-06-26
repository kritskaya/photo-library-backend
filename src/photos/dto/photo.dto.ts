import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}-[0-9]+$/)
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

export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {}
