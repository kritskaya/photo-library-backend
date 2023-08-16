import { forwardRef, Module } from '@nestjs/common';
import { CollectionModule } from '../collections/collection.module';
import { PhotoModule } from '../photos/photo.module';
import { AlbumPrismaRepository } from '../repositories/album.prisma.repository';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [forwardRef(() => CollectionModule), forwardRef(() => PhotoModule)],
  providers: [AlbumService, AlbumPrismaRepository],
  controllers: [AlbumController],
  exports: [AlbumService]
})
export class AlbumModule {}
