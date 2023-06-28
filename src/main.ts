import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/upload', express.static(join(__dirname, '..', 'upload')));

  await app.listen(3000);
}
bootstrap();
