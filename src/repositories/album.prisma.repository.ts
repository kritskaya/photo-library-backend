import { Injectable } from '@nestjs/common';
import { Album, Prisma } from '@prisma/client';
import { CreateAlbumDto, UpdateAlbumDto } from '../albums/dto/album.dto';
import { ALBUMS_PER_PAGE_DEFAULT, START_PAGE } from '../common/constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumPrismaRepository {
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

  async delete(id: number): Promise<{ deletedAlbum: Album; pathsToDelete: string[] }> {
    const { photosIdsToDelete, pathsToDelete } = await this.getPhotosFromDeletedAlbums([id]);

    const [_deletedPhoto, deletedAlbum] = await this.prisma.$transaction([
      //delete photos
      this.prisma.photo.deleteMany({
        where: {
          id: {
            in: photosIdsToDelete,
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

    return {
      deletedAlbum: deletedAlbum,
      pathsToDelete: pathsToDelete,
    };
  }

  async getPhotosFromDeletedAlbums(deletedAlbumsIds: number[]) {
    // all photos from deleted album
    const deletedAlbumPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: {
            in: deletedAlbumsIds,
          },
        },
      })
    ).map((location) => location.photoId);

    // all photos from deleted album that related to another not deleted albums
    const deletedAlbumManyLocationsPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: {
            notIn: deletedAlbumsIds,
          },
          photoId: {
            in: deletedAlbumPhotoIds,
          },
        },
      })
    ).map((location) => location.photoId);

    // photos that located only in the deleted albums
    const photosIdsToDelete: number[] = [];
    deletedAlbumPhotoIds.forEach((photoId) => {
      if (!deletedAlbumManyLocationsPhotoIds.includes(photoId)) {
        photosIdsToDelete.push(photoId);
      }
    });

    const pathsToDelete = (
      await this.prisma.photo.findMany({
        where: {
          id: {
            in: photosIdsToDelete,
          },
        },
      })
    ).map((photos) => photos.path);

    return {
      photosIdsToDelete: photosIdsToDelete,
      pathsToDelete: pathsToDelete,
    };
  }

  async count(condition: Prisma.AlbumWhereInput): Promise<number> {
    return this.prisma.album.count({
      where: condition,
    });
  }
}
