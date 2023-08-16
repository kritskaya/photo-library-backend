import { Injectable } from '@nestjs/common';
import { Photo, Prisma } from '@prisma/client';
import { join } from 'path';
import { PHOTOS_PER_PAGE_DEFAULT, START_PAGE, UPLOAD_PATH } from '../common/constants';
import { deleteFile } from '../common/utils/fs.utils';
import { PhotoPrismaRepositoty } from '../repositories/photo.prisma.repository';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(private photoRepository: PhotoPrismaRepositoty) {}

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.findAll();
  }

  async findMany(
    perPage = PHOTOS_PER_PAGE_DEFAULT,
    page = START_PAGE,
    condition?: Prisma.PhotoWhereInput,
  ) {
    return this.photoRepository.findMany(perPage, page, condition);
  }

  async findById(id: number): Promise<Photo> {
    return this.photoRepository.findById(id);
  }

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    return this.photoRepository.create(createPhotoDto);
  }

  async update(updatePhotoDto: UpdatePhotoDto, oldPhoto: Photo): Promise<Photo> {
    return this.photoRepository.update(updatePhotoDto, oldPhoto);
  }

  async delete(id: number): Promise<Photo> {
    const deletedPhoto = await this.photoRepository.delete(id);

    if (deletedPhoto && deletedPhoto.path) {
      const filePath = join(UPLOAD_PATH, deletedPhoto.path);

      if (filePath) {
        await deleteFile(filePath);
      }
    }

    return deletedPhoto;
  }

  async count(condition: Prisma.PhotoWhereInput): Promise<number> {
    return this.photoRepository.count(condition);
  }

  async upload(newPhoto: Photo, file: Express.Multer.File) {
    const updatedPhoto = await this.photoRepository.update({ path: file.filename }, newPhoto);
    return updatedPhoto;
  }
}
