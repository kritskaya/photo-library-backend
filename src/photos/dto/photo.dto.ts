import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePhotoDto {
  @ApiPropertyOptional({ example: '2023-06-26T13:08:16.833Z' })
  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @ApiPropertyOptional({ example: 'BY-1234567' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}-[0-9]+$/)
  officialID?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromPerson?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePhotoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ example: '2023-06-26T13:08:16.833Z' })
  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @ApiPropertyOptional({ example: 'BY-1234567' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}-[0-9]+$/)
  officialID?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromPerson?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
