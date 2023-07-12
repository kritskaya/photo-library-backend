import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CollectionService } from '../collections/collection.service';
import { ExceptionMessages } from '../common/messages';
import { PhotoService } from '../photos/photo.service';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { AlbumEntity } from './entity/album.entity';
import { AlbumQueryParams } from './params/album.params';

@ApiTags('albums')
@Controller('albums')
export class AlbumController {
  constructor(
    private albumService: AlbumService,
    private collectionService: CollectionService,
    private photoService: PhotoService,
  ) {}

  @ApiOkResponse({ type: [AlbumEntity] })
  @Get()
  async findMany(@Query(new ValidationPipe({ transform: true })) queryParams: AlbumQueryParams) {
    const { page, perPage, ...rest } = queryParams;
    const albums = await this.albumService.findMany(perPage, page, rest);

    const count = await this.albumService.count(rest);

    return {
      data: albums,
      totalCount: count,
    };
    //return await this.albumService.findAll();
  }

  @ApiOkResponse({ type: AlbumEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.ALBUM_NOT_FOUND })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const album = await this.albumService.findById(id);

    if (!album) {
      throw new NotFoundException(ExceptionMessages.ALBUM_NOT_FOUND);
    }

    return album;
  }

  @ApiCreatedResponse({ type: AlbumEntity })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body() body: CreateAlbumDto) {
    if (body.collectionId) {
      const collection = await this.collectionService.findById(body.collectionId);

      if (!collection) {
        throw new BadRequestException(ExceptionMessages.COLLECTION_NOT_FOUND);
      }
    }

    if (body.coverId) {
      const cover = this.photoService.findById(body.coverId);

      if (!cover) {
        throw new BadRequestException(ExceptionMessages.PHOTO_NOT_FOUND);
      }
    }

    const newAlbum = await this.albumService.create(body);
    return newAlbum;
  }

  @ApiOkResponse({ type: AlbumEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.ALBUM_NOT_FOUND })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateAlbumDto) {
    const album = await this.albumService.findById(id);
    if (!album) {
      throw new NotFoundException(ExceptionMessages.ALBUM_NOT_FOUND);
    }

    if (body.collectionId) {
      const collection = await this.collectionService.findById(body.collectionId);

      if (!collection) {
        throw new BadRequestException(ExceptionMessages.COLLECTION_NOT_FOUND);
      }
    }

    if (body.coverId) {
      const cover = this.photoService.findById(body.coverId);

      if (!cover) {
        throw new BadRequestException(ExceptionMessages.PHOTO_NOT_FOUND);
      }
    }

    const updatedAlbum = await this.albumService.update(id, body, album);
    return updatedAlbum;
  }

  @ApiOkResponse({ type: AlbumEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.ALBUM_NOT_FOUND })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const album = this.albumService.findById(id);
    if (!album) {
      throw new NotFoundException(ExceptionMessages.ALBUM_NOT_FOUND);
    }

    const deletedAlbum = await this.albumService.delete(id);
    return deletedAlbum;
  }
}
