import { Injectable } from '@nestjs/common';
import { Photo, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Photo[]> {
    return this.prisma.photo.findMany();
  }

  async findMany(
    perPage?: number,
    page?: number,
    condition?: Prisma.PhotoWhereInput,
  ): Promise<Photo[]> {
    return this.prisma.photo.findMany({
      skip: perPage * page,
      take: perPage,
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

  async update(id: number, updatePhotoDto: UpdatePhotoDto, oldPhoto: Photo): Promise<Photo> {
    return this.prisma.photo.update({
      where: {
        id,
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
}
