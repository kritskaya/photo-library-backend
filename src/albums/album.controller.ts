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
import { CollectionService } from 'src/collections/collection.service';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';

@Controller('albums')
export class AlbumController {
  constructor(private albumService: AlbumService, private collectionService: CollectionService) {}

  @Get()
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const album = await this.albumService.findById(id);

    if (!album) {
      throw new NotFoundException('Album with such id not found');
    }

    return album;
  }

  @Post()
  async create(@Body(ValidationPipe) body: CreateAlbumDto) {
    if (body.collectionId) {
      const collection = await this.collectionService.findById(body.collectionId);

      if (!collection) {
        throw new BadRequestException('Collection with such id is not found');
      }
    }

    // todo: check if cover exist

    const newAlbum = await this.albumService.create(body);
    return newAlbum;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) body: UpdateAlbumDto) {
    const album = await this.albumService.findById(id);
    if (!album) {
      throw new NotFoundException('Album with such id not found');
    }

    if (body.collectionId) {
      const collection = await this.collectionService.findById(body.collectionId);

      if (!collection) {
        throw new BadRequestException('Collection with such id is not found');
      }
    }

    // todo: check if cover exist

    const updatedAlbum = await this.albumService.update(id, body, album);
    return updatedAlbum;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const album = this.albumService.findById(id);
    if (!album) {
      throw new NotFoundException('Album with such id not found');
    }

    const deletedAlbum = await this.albumService.delete(id);
    return deletedAlbum;
  }
}
