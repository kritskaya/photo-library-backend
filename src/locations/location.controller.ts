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
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from '../albums/album.service';
import { PhotoService } from '../photos/photo.service';
import { CreateLocationDto, DeleteLocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(
    private locationService: LocationService,
    private albumService: AlbumService,
    private photoService: PhotoService,
  ) {}

  @Get('album/:id')
  async findLocationsByAlbum(@Param('id', ParseIntPipe) id: number) {
    const album = await this.albumService.findById(id);
    if (!album) {
      throw new NotFoundException('Album with such id not found');
    }

    const locations = await this.locationService.findLocationsByAlbum(id);

    return {
      albumId: id,
      photoIds: locations.map((location) => location.photoId),
    };
  }

  @Get('photo/:id')
  async findLocationsByPhoto(@Param('id', ParseIntPipe) id: number) {
    const photo = await this.photoService.findById(id);
    if (!photo) {
      throw new NotFoundException('Photo with such id not found');
    }

    const locations = await this.locationService.findLocationsByPhoto(id);

    return {
      photoId: id,
      albumIds: locations.map((location) => location.albumId),
    };
  }

  @Post()
  async createLocation(@Body() body: CreateLocationDto) {
    const album = await this.albumService.findById(body.albumId);
    if (!album) {
      throw new BadRequestException('Album with such id not found');
    }

    const photo = await this.photoService.findById(body.photoId);
    if (!photo) {
      throw new BadRequestException('Photo with such id not found');
    }

    const newLocation = await this.locationService.createLocation(body);
    return newLocation;
  }

  @Delete()
  async deleteLocation(@Body() body: DeleteLocationDto) {
    const locations = await this.locationService.findLocationsByPhoto(body.photoId);
    const location = locations.find((location) => location.albumId === body.albumId);
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    const deletedLocation = await this.locationService.deleteLocation(location.id);
    return deletedLocation;
  }
}
