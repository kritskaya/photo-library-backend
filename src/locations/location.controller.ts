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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AlbumService } from '../albums/album.service';
import { ExceptionMessages } from '../common/messages';
import { PhotoService } from '../photos/photo.service';
import { CreateLocationDto, DeleteLocationDto } from './dto/location.dto';
import { LocationEntity } from './entity/location.entity';
import { LocationService } from './location.service';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(
    private locationService: LocationService,
    private albumService: AlbumService,
    private photoService: PhotoService,
  ) {}

  @ApiOkResponse({ type: LocationEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.LOCATION_NOT_FOUND })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const location = await this.locationService.findLocationById(id);
    if (!location) {
      throw new NotFoundException(ExceptionMessages.LOCATION_NOT_FOUND);
    }

    return location;
  }

  @ApiOkResponse({ type: [LocationEntity] })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.ALBUM_NOT_FOUND })
  @Get('album/:id')
  async findByAlbumId(@Param('id', ParseIntPipe) id: number) {
    const album = await this.albumService.findById(id);
    if (!album) {
      throw new NotFoundException(ExceptionMessages.ALBUM_NOT_FOUND);
    }

    const locations = await this.locationService.findLocationsByAlbum(id);

    return locations;
  }

  @ApiOkResponse({ type: [LocationEntity] })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  @Get('photo/:id')
  async findByPhotoId(@Param('id', ParseIntPipe) id: number) {
    const photo = await this.photoService.findById(id);
    if (!photo) {
      throw new NotFoundException(ExceptionMessages.PHOTO_NOT_FOUND);
    }

    const locations = await this.locationService.findLocationsByPhoto(id);

    return locations;
  }

  @ApiCreatedResponse({ type: LocationEntity })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body() body: CreateLocationDto) {
    const album = await this.albumService.findById(body.albumId);
    if (!album) {
      throw new BadRequestException(ExceptionMessages.ALBUM_NOT_FOUND);
    }

    const photo = await this.photoService.findById(body.photoId);
    if (!photo) {
      throw new BadRequestException(ExceptionMessages.PHOTO_NOT_FOUND);
    }

    const existingLocation = (await this.locationService.findLocationsByAlbum(body.albumId)).find(
      (location) => location.photoId === body.photoId,
    );

    if (existingLocation) {
      throw new BadRequestException(ExceptionMessages.LOCATION_EXISTS);
    }

    const newLocation = await this.locationService.createLocation(body);
    return newLocation;
  }

  @ApiOkResponse({ type: LocationEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.LOCATION_NOT_FOUND })
  @Delete(':id')
  // async deleteLocation(@Body() body: DeleteLocationDto) {
  async delete(@Param('id', ParseIntPipe) id: number) {
    const location = await this.locationService.findLocationById(id);
    if (!location) {
      throw new NotFoundException(ExceptionMessages.LOCATION_NOT_FOUND);
    }

    const deletedLocation = await this.locationService.deleteLocation(id);
    return deletedLocation;
  }
}
