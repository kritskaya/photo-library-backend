import { Module } from '@nestjs/common';
import { AlbumModule } from '../albums/album.module';
import { PhotoModule } from '../photos/photo.module';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [AlbumModule, PhotoModule],
})
export class LocationModule {}
