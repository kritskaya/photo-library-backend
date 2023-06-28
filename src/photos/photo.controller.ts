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
  Query,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePhotoDto, UpdatePhotoDto } from './dto/photo.dto';
import { PhotosQueryParams } from './params/photo.params';
import { PhotoService } from './photo.service';
import { imageFileFilter } from './multer/imagePhotoFilter';
import { storage } from './multer/multerStorage';
import { UPLOAD_PATH } from 'src/common/constants';

@Controller('photos')
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Get()
  async findMany(@Query(ValidationPipe) queryParams: PhotosQueryParams) {
    const { page, perPage, ...rest } = queryParams;
    const photos = await this.photoService.findMany(Number(perPage), Number(page), rest);

    return photos;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const photo = await this.photoService.findById(id);

    if (!photo) {
      throw new NotFoundException('Photo with such id not found');
    }

    return photo;
  }

  @Post()
  async create(@Body(new ValidationPipe({ transform: true })) body: CreatePhotoDto) {
    const newPhoto = await this.photoService.create(body);

    return newPhoto;
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      fileFilter: imageFileFilter,
      storage: storage,
    }),
  )
  async uploadFile(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    console.log(files);
    return {
      urls: files.map((file) => `${UPLOAD_PATH}/${file.originalname}`),
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) body: UpdatePhotoDto) {
    const photo = await this.photoService.findById(id);
    if (!photo) {
      throw new NotFoundException('Photo with such id not found');
    }

    const updatedPhoto = this.photoService.update(id, body, photo);

    return updatedPhoto;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const photo = await this.photoService.findById(id);
    if (!photo) {
      throw new NotFoundException('Photo with such id not found');
    }

    const deletedPhoto = this.photoService.delete(id);
    return deletedPhoto;
  }
}
