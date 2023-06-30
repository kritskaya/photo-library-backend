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
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CollectionService } from 'src/collections/collection.service';
import { ExceptionMessages } from 'src/common/messages';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { AlbumEntity } from './entity/album.entity';

@ApiTags('albums')
@Controller('albums')
export class AlbumController {
  constructor(private albumService: AlbumService, private collectionService: CollectionService) {}

  @ApiOkResponse({ type: [AlbumEntity] })
  @Get()
  async findAll() {
    return await this.albumService.findAll();
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
  async create(@Body(ValidationPipe) body: CreateAlbumDto) {
    if (body.collectionId) {
      const collection = await this.collectionService.findById(body.collectionId);

      if (!collection) {
        throw new BadRequestException(ExceptionMessages.COLLECTION_NOT_FOUND);
      }
    }

    // todo: check if cover exist

    const newAlbum = await this.albumService.create(body);
    return newAlbum;
  }

  @ApiOkResponse({ type: AlbumEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.ALBUM_NOT_FOUND })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) body: UpdateAlbumDto) {
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

    // todo: check if cover exist

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
