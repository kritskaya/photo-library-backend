import { Injectable } from '@nestjs/common';
import { Collection } from '@prisma/client';
import { CreateCollectionDto, UpdateCollectionDto } from '../collections/dto/collection.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AlbumPrismaRepository } from './album.prisma.repository';

@Injectable()
export class CollectionPrismaRepository {
  constructor(private prisma: PrismaService, private albumRepository: AlbumPrismaRepository) {}

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

  async delete(id: number): Promise<{ deletedCollection: Collection; pathsToDelete: string[] }> {
    const deletedAlbumsIds = (
      await this.prisma.album.findMany({
        where: {
          collectionId: id,
        },
      })
    ).map((album) => album.id);

    const { photosIdsToDelete, pathsToDelete } =
      await this.albumRepository.getPhotosFromDeletedAlbums(deletedAlbumsIds);

    const [_deletedPhoto, deletedCollection] = await this.prisma.$transaction([
      //delete photos
      this.prisma.photo.deleteMany({
        where: {
          id: {
            in: photosIdsToDelete,
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

    return {
      deletedCollection: deletedCollection,
      pathsToDelete: pathsToDelete,
    };
  }
}
