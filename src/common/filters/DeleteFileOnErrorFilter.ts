import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { deleteFile } from '../utils/fs.utils';

@Catch(BadRequestException)
export class DeleteFileOnErrorFilter implements ExceptionFilter {
  constructor() {}
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();

    const file = request.file;

    if (file && file.path) {
      await deleteFile(file.path);
    }

    response.status(status).json(exception.getResponse());
  }
}
