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
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiGatewayTimeoutResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';
import { PhotosQueryParams } from './params/photo.params';
import { PhotoService } from './photo.service';
import { imageFileFilter } from './multer/imagePhotoFilter';
import { storage } from './multer/multerStorage';
import { PhotoEntity } from './entity/photo.entity';
import { UploadResponseEntity } from './entity/upload.response.entity';
import { FilesUploadDto } from './dto/file.dto';
import { UPLOAD_PATH } from '../common/constants';
import { ExceptionMessages } from '../common/messages';
import { PathValidationPipe } from '../common/validation/pipes/PathValidationPipe';
import { getFileName } from '../common/utils/upload.utils';

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

  // @ApiOkResponse({ type: PhotoEntity })
  // @ApiBadRequestResponse()
  // @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async create(@Body(PathValidationPipe) body: CreatePhotoDto) {
  //   const newPhoto = await this.photoService.create(body);

  //   return newPhoto;
  // }
  @ApiOkResponse({ type: PhotoEntity })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body(new ValidationPipe({ transform: true })) body: CreatePhotoDto) {
    const newPhoto = await this.photoService.create(body);

    return newPhoto;
  }

  @ApiCreatedResponse({ type: UploadResponseEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of images with format *.jpg, *.png, *.gif',
    type: FilesUploadDto,
  })
  @Post(':id/upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      fileFilter: imageFileFilter,
      storage: storage,
    }),
  )
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles(new ParseFilePipe({ fileIsRequired: true }))
    files: Express.Multer.File[],
  ) {
    const photo = await this.photoService.findById(id);

    if (!photo) {
      throw new NotFoundException(ExceptionMessages.PHOTO_NOT_FOUND);
    }

    const urls = await this.photoService.upload(id, photo, files);

    return {
      urls: urls,
    };
  }

  @ApiOkResponse({ type: PhotoEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(PathValidationPipe) body: UpdatePhotoDto,
  ) {
    const photo = await this.photoService.findById(id);
    if (!photo) {
      throw new NotFoundException(ExceptionMessages.PHOTO_NOT_FOUND);
    }

    const updatedPhoto = this.photoService.update(id, body, photo);

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

    const deletedPhoto = this.photoService.delete(id);
    return deletedPhoto;
  }
}
