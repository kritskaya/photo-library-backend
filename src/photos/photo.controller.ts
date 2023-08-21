import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';
import { PhotosQueryParams } from './params/photo.params';
import { PhotoService } from './photo.service';
import { imageFileFilter } from './multer/imagePhotoFilter';
import { storage } from './multer/multerStorage';
import { PhotoEntity } from './entity/photo.entity';
import { ExceptionMessages } from '../common/messages';
import { NotEmptyPayloadPipe } from '../common/validation/pipes/NotEmptyPayloadPipe';
import { DeleteFileOnErrorFilter } from '../common/filters/DeleteFileOnErrorFilter';

@ApiTags('photos')
@Controller('photos')
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @ApiOkResponse({ type: [PhotoEntity] })
  @Get()
  async findMany(@Query(new ValidationPipe({ transform: true })) queryParams: PhotosQueryParams) {
    const { page, perPage, ...rest } = queryParams;
    const photos = await this.photoService.findMany(perPage, page, rest);

    const count = await this.photoService.count(rest);

    return {
      data: photos,
      totalCount: count,
    };
  }

  @ApiCreatedResponse({ type: PhotoEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const photo = await this.photoService.findById(id);

    if (!photo) {
      throw new NotFoundException(ExceptionMessages.PHOTO_NOT_FOUND);
    }

    return photo;
  }

  @ApiCreatedResponse({ type: PhotoEntity })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      storage: storage,
    }),
  )
  @UseFilters(new DeleteFileOnErrorFilter())
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) body: CreatePhotoDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    const newPhoto = await this.photoService.create(body, file);
    return newPhoto;
  }

  @ApiOkResponse({ type: PhotoEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(NotEmptyPayloadPipe) body: UpdatePhotoDto,
  ) {
    const photo = await this.photoService.findById(id);
    if (!photo) {
      throw new NotFoundException(ExceptionMessages.PHOTO_NOT_FOUND);
    }

    const updatedPhoto = await this.photoService.update(body, photo);

    return updatedPhoto;
  }

  @ApiOkResponse({ type: PhotoEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const photo = await this.photoService.findById(id);
    if (!photo) {
      throw new NotFoundException(ExceptionMessages.PHOTO_NOT_FOUND);
    }

    const deletedPhoto = await this.photoService.delete(id);
    return deletedPhoto;
  }
}
