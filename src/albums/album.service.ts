import { Injectable } from '@nestjs/common';
import { Album, Prisma } from '@prisma/client';
import { join } from 'path';
import { ALBUMS_PER_PAGE_DEFAULT, START_PAGE, UPLOAD_PATH } from '../common/constants';
import { deleteFile } from '../common/utils/fs.utils';
import { AlbumPrismaRepository } from '../repositories/album.prisma.repository';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumService {
  constructor(private albumRepository: AlbumPrismaRepository) {}

  async findAll(): Promise<Album[]> {
    return this.albumRepository.findAll();
  }

  async findMany(
    perPage = ALBUMS_PER_PAGE_DEFAULT,
    page = START_PAGE,
    condition?: Prisma.AlbumWhereInput,
  ): Promise<Album[]> {
    return this.albumRepository.findMany(perPage, page, condition);
  }

  async findById(id: number): Promise<Album> {
    return this.albumRepository.findById(id);
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumRepository.create(createAlbumDto);
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto, oldAlbum: Album): Promise<Album> {
    return this.albumRepository.update(id, updateAlbumDto, oldAlbum);
  }

  async delete(id: number): Promise<Album> {
    const { deletedAlbum, pathsToDelete } = await this.albumRepository.delete(id);

    for (const path of pathsToDelete) {
      const fullPath = join(UPLOAD_PATH, path);
      deleteFile(fullPath);
    }

    return deletedAlbum;
  }

  async count(condition: Prisma.AlbumWhereInput): Promise<number> {
    return this.albumRepository.count(condition);
  }
}
