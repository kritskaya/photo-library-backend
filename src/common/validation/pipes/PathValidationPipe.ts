import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { access, constants } from 'fs/promises';
import { join } from 'path';
import { UPLOAD_PATH } from '../../../common/constants';
import { CreatePhotoDto } from '../../../photos/dto/photo.dto';
import { ExceptionMessages } from '../../messages';

@Injectable()
export class PathValidationPipe implements PipeTransform {
  async transform(value: CreatePhotoDto, metadata: ArgumentMetadata) {
    const fullPath = join(UPLOAD_PATH, value.path);

    try {
      await access(fullPath, constants.F_OK);
    } catch {
      throw new BadRequestException(ExceptionMessages.INVALID_PATH);
    }

    return value;
  }
}
