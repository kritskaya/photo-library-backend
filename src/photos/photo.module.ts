import { forwardRef, Module } from '@nestjs/common';
import { AlbumModule } from '../albums/album.module';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [forwardRef(() => AlbumModule)],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
