import { Injectable } from "@nestjs/common";
import { Collection } from "@prisma/client";
import { CreateCollectionDto, UpdateCollectionDto } from "../collections/dto/collection.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CollectionPrismaRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Collection[]> {
    return this.prisma.collection.findMany();
  }

  async findById(id: number): Promise<Collection> {
    return this.prisma.collection.findUnique({
      where: {
        id,
      },
    });
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    return this.prisma.collection.create({
      data: {
        name: createCollectionDto.name,
      },
    });
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto): Promise<Collection> {
    return this.prisma.collection.update({
      where: {
        id,
      },
      data: {
        name: updateCollectionDto.name,
      },
    });
  }

  async delete(id: number): Promise<Collection> {
    const deletedAlbumsIds = (
      await this.prisma.album.findMany({
        where: {
          collectionId: id,
        },
      })
    ).map((album) => album.id);

    // all photos from deleted albums
    const deletedAlbumsPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: {
            in: deletedAlbumsIds,
          },
        },
      })
    ).map((location) => location.photoId);

    // all photos from deleted albums that related to another not deleted albums
    const deletedAlbumsManyLocationsPhotoIds = (
      await this.prisma.location.findMany({
        where: {
          albumId: {
            notIn: deletedAlbumsIds,
          },
          photoId: {
            in: deletedAlbumsPhotoIds,
          },
        },
      })
    ).map((location) => location.photoId);

    // photos that located only in the deleted albums
    const deletedPhotoIds: number[] = [];
    deletedAlbumsPhotoIds.forEach((photoId) => {
      if (!deletedAlbumsManyLocationsPhotoIds.includes(photoId)) {
        deletedPhotoIds.push(photoId);
      }
    });

    const [_covers, _deletedLocations, _deletedPhoto, _deletedAlbums, deletedCollection] =
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
            albumId: {
              in: deletedAlbumsIds,
            },
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

        //delete albums
        this.prisma.album.deleteMany({
          where: {
            id: {
              in: deletedAlbumsIds,
            },
          },
        }),

        //delete collection
        this.prisma.collection.delete({
          where: {
            id,
          },
        }),
      ]);

    return deletedCollection;
  }
}