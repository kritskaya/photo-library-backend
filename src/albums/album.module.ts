import { Module } from '@nestjs/common';
import { CollectionModule } from 'src/collections/collection.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [CollectionModule],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
