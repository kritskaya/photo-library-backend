import { forwardRef, Module } from '@nestjs/common';
import { AlbumModule } from '../albums/album.module';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [forwardRef(() => AlbumModule)],
  providers: [CollectionService],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule {}
