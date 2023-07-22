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
import { PathValidationPipe } from '../common/validation/pipes/PathValidationPipe';
import { NotEmptyPayloadPipe } from '../common/validation/pipes/NotEmptyPayloadPipe';

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
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) body: CreatePhotoDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    const newPhoto = await this.photoService.create(body);
    const updatedPhoto = await this.photoService.upload(newPhoto.id, newPhoto, file);
    return updatedPhoto;
  }

  // @ApiCreatedResponse({ type: UploadResponseEntity })
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  // @ApiUnprocessableEntityResponse()
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'file with format *.jpg, *.png, *.gif',
  //   type: FileUploadDto,
  // })
  // @Post(':id/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     fileFilter: imageFileFilter,
  //     storage: storage,
  //   }),
  // )
  // async uploadFile(
  //   @Param('id', ParseIntPipe) id: number,
  //   @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
  //   file: Express.Multer.File,
  // ) {
  //   const photo = await this.photoService.findById(id);

  // if (!photo) {
  //   this.photoService.deleteFileByPath(join(UPLOAD_PATH, getFileName(file.originalname, id)));
  //   throw new NotFoundException(ExceptionMessages.PHOTO_NOT_FOUND);
  // }

  //   const updatedPhoto = await this.photoService.upload(id, photo, file);

  //   return {
  //     data: updatedPhoto,
  //     url: `${UPLOAD_PATH}/${updatedPhoto.path}`,
  //   };
  // }

  @ApiOkResponse({ type: PhotoEntity })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: ExceptionMessages.PHOTO_NOT_FOUND })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(PathValidationPipe, NotEmptyPayloadPipe) body: UpdatePhotoDto,
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
