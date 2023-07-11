import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { join } from 'path';
import { UPLOAD_PATH } from '../../../common/constants';
import { CreatePhotoDto } from '../../../photos/dto/photo.dto';
import { ExceptionMessages } from '../../messages';
import { fileExists } from '../../utils/fs.utils';

@Injectable()
export class PathValidationPipe implements PipeTransform {
  async transform(value: CreatePhotoDto, metadata: ArgumentMetadata) {
    const fullPath = join(UPLOAD_PATH, value.path);

    if (!fileExists(fullPath)) {
      throw new BadRequestException(ExceptionMessages.INVALID_PATH);
    }

    return value;
  }
}
