import { Module } from '@nestjs/common';
import { AlbumModule } from './albums/album.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionModule } from './collections/collection.module';
import { LocationModule } from './locations/location.module';
import { PhotoModule } from './photos/photo.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaModule, CollectionModule, AlbumModule, PhotoModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
