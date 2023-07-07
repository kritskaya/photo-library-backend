import { Injectable } from '@nestjs/common';
import { Photo, Prisma } from '@prisma/client';
import { PHOTOS_PER_PAGE_DEFAULT, START_PAGE } from '../common/constants';
import { PhotoPrismaRepositoty } from '../repositories/photo.prisma.repository';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(private photos: PhotoPrismaRepositoty) {}

  async findAll(): Promise<Photo[]> {
    return this.photos.findAll();
  }

  async findMany(
    perPage = PHOTOS_PER_PAGE_DEFAULT,
    page = START_PAGE,
    condition?: Prisma.PhotoWhereInput,
  ) {
    return this.photos.findMany(perPage, page, condition);
  }

  async findById(id: number): Promise<Photo> {
    return this.photos.findById(id);
  }

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    return this.photos.create(createPhotoDto);
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto, oldPhoto: Photo): Promise<Photo> {
    return this.photos.update(id, updatePhotoDto, oldPhoto);
  }

  async delete(id: number): Promise<Photo> {
    return this.photos.delete(id);
  }

  async count(condition: Prisma.PhotoWhereInput): Promise<number> {
    return this.photos.count(condition);
  }
}
