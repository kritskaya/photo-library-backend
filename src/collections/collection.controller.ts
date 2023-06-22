import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';

@Controller('collections')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get()
  async findAll() {
    return await this.collectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const collection = await this.collectionService.findById(id);

    if (!collection) {
      throw new NotFoundException('Collection with such id not found');
    }

    return collection;
  }

  @Post()
  async create(@Body(ValidationPipe) body: CreateCollectionDto) {
    const newCollection = await this.collectionService.create(body);
    return newCollection;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: UpdateCollectionDto,
  ) {
    const collection = await this.collectionService.findById(id);

    if (!collection) {
      throw new NotFoundException('Collection with such id not found');
    }

    const updatedCollection = await this.collectionService.update(id, body);
    return updatedCollection;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const collection = await this.collectionService.findById(id);

    if (!collection) {
      throw new NotFoundException('Collection with such id not found');
    }

    const deletedCollection = this.collectionService.delete(id);
    return deletedCollection;
  }
}
