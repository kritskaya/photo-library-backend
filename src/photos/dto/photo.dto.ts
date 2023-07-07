import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches, NotEquals, ValidateIf } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  path: string;

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
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  path: string;

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
