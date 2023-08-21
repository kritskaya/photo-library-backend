import { Injectable } from '@nestjs/common';
import { Location } from '@prisma/client';
import { LocationPrismaRepository } from '../repositories/location.prisma.repository';
import { CreateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private locationRepository: LocationPrismaRepository) {}

  async findLocationById(locationId: number): Promise<Location> {
    return this.locationRepository.findLocationById(locationId);
  }

  async findLocationsByAlbum(albumId: number): Promise<Location[]> {
    return this.locationRepository.findLocationsByAlbum(albumId);
  }

  async findLocationsByPhoto(photoId: number): Promise<Location[]> {
    return this.locationRepository.findLocationsByPhoto(photoId);
  }

  async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationRepository.createLocation(createLocationDto);
  }

  async deleteLocation(id: number): Promise<Location> {
    return this.locationRepository.deleteLocation(id);
  }
}
