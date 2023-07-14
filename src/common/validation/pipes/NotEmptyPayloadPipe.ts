import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ExceptionMessages } from '../../messages';

export class NotEmptyPayloadPipe implements PipeTransform {
  transform(payload: any) {
    if (!Object.keys(payload).length) {
      throw new BadRequestException(ExceptionMessages.EMPTY_PAYLOAD);
    }
    return payload;
  }
}
