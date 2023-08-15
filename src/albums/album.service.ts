import { Injectable } from '@nestjs/common';
import { Album, Prisma } from '@prisma/client';
import { join } from 'path';
import { ALBUMS_PER_PAGE_DEFAULT, START_PAGE, UPLOAD_PATH } from '../common/constants';
import { deleteFile } from '../common/utils/fs.utils';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findMany(
    perPage = ALBUMS_PER_PAGE_DEFAULT,
    page = START_PAGE,
    condition?: Prisma.AlbumWhereInput,
  ): Promise<Album[]> {
    return this.prisma.album.findMany({
      skip: perPage && page ? perPage * page : START_PAGE,
      take: perPage || ALBUMS_PER_PAGE_DEFAULT,
      where: condition,
    });
  }

  async findById(id: number): Promise<Album> {
    return this.prisma.album.findUnique({
      where: {
        id,
      },
    });
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        coverId: createAlbumDto.coverId,
        collectionId: createAlbumDto.collectionId,
      },
    });
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto, oldAlbum: Album): Promise<Album> {
    return this.prisma.album.update({
      where: {
        id,
      },
      data: {
        name: updateAlbumDto.name ? updateAlbumDto.name : oldAlbum.name,
        coverId: updateAlbumDto.coverId !== undefined ? updateAlbumDto.coverId : oldAlbum.coverId,
        collectionId:
          updateAlbumDto.collectionId !== undefined
            ? updateAlbumDto.collectionId
            : oldAlbum.collectionId,
      },
    });
  }

  async delete(id: number): Promise<Album> {
    // all photos from deleted album
    const deletedAlbumPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: id,
        },
      })
    ).map((location) => location.photoId);

    // all photos from deleted album that related to another not deleted albums
    const deletedAlbumManyLocationsPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: {
            not: id,
          },
          photoId: {
            in: deletedAlbumPhotoIds,
          },
        },
      })
    ).map((location) => location.photoId);

    // photos that located only in the deleted albums
    const deletedPhotoIds: number[] = [];
    deletedAlbumPhotoIds.forEach((photoId) => {
      if (!deletedAlbumManyLocationsPhotoIds.includes(photoId)) {
        deletedPhotoIds.push(photoId);
      }
    });

    // file paths to delete
    const pathsToDelete = (
      await this.prisma.photo.findMany({
        where: {
          id: {
            in: deletedPhotoIds,
          },
        },
      })
    ).map((photos) => photos.path);

    const [_covers, _deletedLocations, _deletedPhoto, deletedAlbum] =
      await this.prisma.$transaction([
        // update album covers
        this.prisma.album.updateMany({
          data: {
            coverId: null,
          },
          where: {
            coverId: {
              in: deletedPhotoIds,
            },
          },
        }),

        // delete locations
        this.prisma.location.deleteMany({
          where: {
            albumId: id,
          },
        }),

        //delete photos
        this.prisma.photo.deleteMany({
          where: {
            id: {
              in: deletedPhotoIds,
            },
          },
        }),

        //delete album
        this.prisma.album.delete({
          where: {
            id,
          },
        }),
      ]);

    for (const path of pathsToDelete) {
      const fullPath = join(UPLOAD_PATH, path);
      deleteFile(fullPath);
    }

    return deletedAlbum;
  }

  async count(condition: Prisma.AlbumWhereInput): Promise<number> {
    return this.prisma.album.count({
      where: condition,
    });
  }
}
