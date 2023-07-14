import { Injectable } from '@nestjs/common';
import { Location } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async findLocationById(locationId: number): Promise<Location> {
    return this.prisma.location.findUnique({
      where: {
        id: locationId,
      },
    });
  }

  async findLocationsByAlbum(albumId: number): Promise<Location[]> {
    return this.prisma.location.findMany({
      where: {
        albumId,
      },
    });
  }

  async findLocationsByPhoto(photoId: number): Promise<Location[]> {
    return this.prisma.location.findMany({
      where: {
        photoId,
      },
    });
  }

  async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.prisma.location.create({
      data: {
        ...createLocationDto,
      },
    });
  }

  async deleteLocation(id: number): Promise<Location> {
    return this.prisma.location.delete({
      where: {
        id,
      },
    });
  }
}
