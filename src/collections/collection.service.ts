import { Injectable } from '@nestjs/common';
import { Collection } from '@prisma/client';
import { join } from 'path';
import { UPLOAD_PATH } from '../common/constants';
import { deleteFile } from '../common/utils/fs.utils';
import { CollectionPrismaRepository } from '../repositories/collection.prisma.repository';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(private collectionRepository: CollectionPrismaRepository) {}

  async findAll(): Promise<Collection[]> {
    return this.collectionRepository.findAll();
  }

  async findById(id: number): Promise<Collection> {
    return this.collectionRepository.findById(id);
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    return this.collectionRepository.create(createCollectionDto);
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto): Promise<Collection> {
    return this.collectionRepository.update(id, updateCollectionDto);
  }

  async delete(id: number): Promise<Collection> {
    const { deletedCollection, pathsToDelete } = await this.collectionRepository.delete(id);

    for (const path of pathsToDelete) {
      const fullPath = join(UPLOAD_PATH, path);
      deleteFile(fullPath);
    }

    return deletedCollection;
  }
}
