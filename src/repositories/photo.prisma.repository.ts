import { Injectable } from '@nestjs/common';
import { Photo, Prisma } from '@prisma/client';
import { PHOTOS_PER_PAGE_DEFAULT, START_PAGE } from '../common/constants';
import { CreatePhotoDto, UpdatePhotoDto } from '../photos/dto/photo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PhotoPrismaRepositoty {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Photo[]> {
    return this.prisma.photo.findMany();
  }

  async findMany(
    perPage = PHOTOS_PER_PAGE_DEFAULT,
    page = START_PAGE,
    condition?: Prisma.PhotoWhereInput,
  ) {
    return this.prisma.photo.findMany({
      skip: perPage && page ? perPage * page : START_PAGE,
      take: perPage || PHOTOS_PER_PAGE_DEFAULT,
      where: condition,
    });
  }

  async findById(id: number): Promise<Photo> {
    return this.prisma.photo.findUnique({
      where: {
        id,
      },
    });
  }

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    return this.prisma.photo.create({
      data: {
        ...createPhotoDto,
        receivedAt: new Date(createPhotoDto.receivedAt),
      },
    });
  }

  async update(updatePhotoDto: UpdatePhotoDto, oldPhoto: Photo): Promise<Photo> {
    return this.prisma.photo.update({
      where: {
        id: oldPhoto.id,
      },
      data: {
        ...updatePhotoDto,
        receivedAt:
          updatePhotoDto.receivedAt === undefined
            ? oldPhoto.receivedAt
            : updatePhotoDto.receivedAt
            ? new Date(updatePhotoDto.receivedAt)
            : updatePhotoDto.receivedAt,
      },
    });
  }

  async delete(id: number): Promise<Photo> {
    return this.prisma.photo.delete({
      where: {
        id,
      },
    });
  }

  async count(condition: Prisma.PhotoWhereInput): Promise<number> {
    return this.prisma.photo.count({
      where: condition,
    });
  }
}
