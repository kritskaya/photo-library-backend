import { forwardRef, Module } from '@nestjs/common';
import { CollectionModule } from 'src/collections/collection.module';
import { PhotoModule } from 'src/photos/photo.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [CollectionModule, forwardRef(() => PhotoModule)],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService]
})
export class AlbumModule {}
