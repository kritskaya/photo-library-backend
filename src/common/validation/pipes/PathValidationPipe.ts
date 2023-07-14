import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { join } from 'path';
import { UPLOAD_PATH } from '../../../common/constants';
import { UpdatePhotoDto } from '../../../photos/dto/photo.dto';
import { ExceptionMessages } from '../../messages';
import { fileExists } from '../../utils/fs.utils';

@Injectable()
export class PathValidationPipe implements PipeTransform {
  async transform(value: UpdatePhotoDto, metadata: ArgumentMetadata) {
    if (typeof value.path !== 'string') {
      return value;
    }

    const fullPath = join(UPLOAD_PATH, value.path);

    if (!(await fileExists(fullPath))) {
      throw new BadRequestException(ExceptionMessages.INVALID_PATH);
    }

    return value;
  }
}
