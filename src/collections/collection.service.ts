import { Injectable } from '@nestjs/common';
import { Collection } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
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
    return this.prisma.collection.delete({
      where: {
        id,
      },
    });
  }
}
