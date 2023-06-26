import { Module } from '@nestjs/common';
import { AlbumModule } from 'src/albums/album.module';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [AlbumModule],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
