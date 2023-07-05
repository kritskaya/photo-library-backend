import { forwardRef, Module } from '@nestjs/common';
import { CollectionModule } from '../collections/collection.module';
import { PhotoModule } from '../photos/photo.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [forwardRef(() => CollectionModule), forwardRef(() => PhotoModule)],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService]
})
export class AlbumModule {}
