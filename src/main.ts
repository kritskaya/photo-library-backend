import * as express from 'express';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CollectionModule } from './collections/collection.module';
import { AlbumModule } from './albums/album.module';
import { PhotoModule } from './photos/photo.module';
import { ValidationPipe } from '@nestjs/common';
import { LocationModule } from './locations/location.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/upload', express.static(join(__dirname, '..', 'upload')));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder().setTitle('Photo Library API').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [CollectionModule, AlbumModule, PhotoModule, LocationModule],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
