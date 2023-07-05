import { Body, Injectable } from '@nestjs/common';
import { Album } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
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
        collcetionId: createAlbumDto.collectionId,
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
        collcetionId:
          updateAlbumDto.collectionId !== undefined
            ? updateAlbumDto.collectionId
            : oldAlbum.collcetionId,
      },
    });
  }

  async delete(id: number): Promise<Album> {
    const deletedPhotoIds: number[] = [];

    // all photos from deleted albums
    const deletedAlbumsPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: id,
        },
      })
    ).map((location) => location.photoId);

    // all photos from deleted albums that related to another not deleted albums
    const deletedAlbumsManyLocationsPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: {
            not: id,
          },
          photoId: {
            in: deletedAlbumsPhotoIds,
          },
        },
      })
    ).map((location) => location.photoId);

    // photos that located only in the deleted albums
    deletedAlbumsPhotoIds.forEach((photoId) => {
      if (deletedAlbumsManyLocationsPhotoIds.includes(photoId)) {
        deletedPhotoIds.push(photoId);
      }
    });

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

    return deletedAlbum;
  }
}
