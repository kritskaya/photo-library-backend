import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AlbumService } from 'src/albums/album.service';
import { ExceptionMessages } from 'src/common/messages';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';
import { CollectionEntity } from './entity/collection.entity';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(private collectionService: CollectionService, private albumService: AlbumService) {}

  @ApiOkResponse({ type: [CollectionEntity] })
  @Get()
  async findAll() {
    return await this.collectionService.findAll();
  }

  @ApiOkResponse({ type: CollectionEntity })
  @ApiNotFoundResponse({ description: ExceptionMessages.COLLECTION_NOT_FOUND })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const collection = await this.collectionService.findById(id);

    if (!collection) {
      throw new NotFoundException(ExceptionMessages.COLLECTION_NOT_FOUND);
    }

    return collection;
  }

  @ApiCreatedResponse({ type: CollectionEntity })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body(ValidationPipe) body: CreateCollectionDto) {
    const newCollection = await this.collectionService.create(body);
    return newCollection;
  }

  @ApiOkResponse({ type: CollectionEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.COLLECTION_NOT_FOUND })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) body: UpdateCollectionDto,
  ) {
    const collection = await this.collectionService.findById(id);

    if (!collection) {
      throw new NotFoundException(ExceptionMessages.COLLECTION_NOT_FOUND);
    }

    const updatedCollection = await this.collectionService.update(id, body);
    return updatedCollection;
  }

  @ApiOkResponse({ type: CollectionEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.COLLECTION_NOT_FOUND })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const collection = await this.collectionService.findById(id);

    if (!collection) {
      throw new NotFoundException(ExceptionMessages.COLLECTION_NOT_FOUND);
    }

    const deletedCollection = this.collectionService.delete(id);
    return deletedCollection;
  }
}
