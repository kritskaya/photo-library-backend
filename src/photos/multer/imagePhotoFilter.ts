import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const fileExtension = extname(file.originalname);

  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  if (validExtensions.some((ext) => fileExtension.includes(ext))) {
    return callback(null, true);
  }

  return callback(
    new HttpException(
      `${file.originalname} is not a valid document`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
    false,
  );
};
