import { HttpStatus } from '@nestjs/common';
import { ExceptionMessages } from '../src/common/messages';
import { albumRoutes, locationRoutes, photosRoutes } from './endpoints';
import { createPhoto, request } from './testUtils';

const createAlbumDto = {
  name: 'Album Name',
};

describe('Location Controller', () => {
  describe('GET', () => {
    it('should return all locations by Album', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse1 = await createPhoto();
      expect(photoCreationResponse1.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse2 = await createPhoto();
      expect(photoCreationResponse2.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse1 = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse1.body.id,
      });
      expect(locationCreationResponse1.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse2 = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse2.body.id,
      });
      expect(locationCreationResponse2.status).toBe(HttpStatus.CREATED);

      const getAllLocationsResponse = await request.get(
        locationRoutes.findByAlbum(albumCreationResponse.body.id),
      );
      expect(getAllLocationsResponse.status).toBe(HttpStatus.OK);
      expect(getAllLocationsResponse.body).toHaveLength(2);

      const locationCleanupResponse1 = await request.delete(
        locationRoutes.delete(locationCreationResponse1.body.id),
      );
      expect(locationCleanupResponse1.status).toBe(HttpStatus.OK);

      const locationCleanupResponse2 = await request.delete(
        locationRoutes.delete(locationCreationResponse2.body.id),
      );
      expect(locationCleanupResponse2.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);

      const photoCleanupResponse1 = await request.delete(
        photosRoutes.delete(photoCreationResponse1.body.id),
      );
      expect(photoCleanupResponse1.status).toBe(HttpStatus.OK);

      const photoCleanupResponse2 = await request.delete(
        photosRoutes.delete(photoCreationResponse2.body.id),
      );
      expect(photoCleanupResponse2.status).toBe(HttpStatus.OK);
    });

    it('should return location by id correctly', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationResponse = await request.get(
        locationRoutes.findById(locationCreationResponse.body.id),
      );
      expect(locationResponse.status).toBe(HttpStatus.OK);
      expect(locationResponse.body.albumId).toBe(albumCreationResponse.body.id);
      expect(locationResponse.body.photoId).toBe(photoCreationResponse.body.id);

      const locationCleanupResponse = await request.delete(
        locationRoutes.delete(locationCreationResponse.body.id),
      );
      expect(locationCleanupResponse.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return all locations by Photo', async () => {
      const albumCreationResponse1 = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse1.status).toBe(HttpStatus.CREATED);

      const albumCreationResponse2 = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse2.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse1 = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse1.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse1.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse2 = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse2.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse2.status).toBe(HttpStatus.CREATED);

      const getAllLocationsResponse = await request.get(
        locationRoutes.findByPhoto(photoCreationResponse.body.id),
      );
      expect(getAllLocationsResponse.status).toBe(HttpStatus.OK);
      expect(getAllLocationsResponse.body).toHaveLength(2);

      const locationCleanupResponse1 = await request.delete(
        locationRoutes.delete(locationCreationResponse1.body.id),
      );
      expect(locationCleanupResponse1.status).toBe(HttpStatus.OK);

      const locationCleanupResponse2 = await request.delete(
        locationRoutes.delete(locationCreationResponse2.body.id),
      );
      expect(locationCleanupResponse2.status).toBe(HttpStatus.OK);

      const albumCleanupResponse1 = await request.delete(
        albumRoutes.delete(albumCreationResponse1.body.id),
      );
      expect(albumCleanupResponse1.status).toBe(HttpStatus.OK);

      const albumCleanupResponse2 = await request.delete(
        albumRoutes.delete(albumCreationResponse2.body.id),
      );
      expect(albumCleanupResponse2.status).toBe(HttpStatus.OK);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);
    });
  });

  describe('POST', () => {
    it('should create location correctly', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);
      expect(locationCreationResponse.body.photoId).toBe(photoCreationResponse.body.id);
      expect(locationCreationResponse.body.albumId).toBe(albumCreationResponse.body.id);

      const locationCleanupResponse = await request.delete(
        locationRoutes.delete(locationCreationResponse.body.id),
      );
      expect(locationCleanupResponse.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST if location with such album and photo id has already exist', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationCopyResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationCopyResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(locationCreationCopyResponse.body.message).toBe(ExceptionMessages.LOCATION_EXISTS);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of wrong album id', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const albumDeleteResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumDeleteResponse.status).toBe(HttpStatus.OK);

      const locationCreationResponse1 = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse1.status).toBe(HttpStatus.BAD_REQUEST);

      const locationCreationResponse2 = await request.post(locationRoutes.create).send({
        albumId: 'not a number',
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse2.status).toBe(HttpStatus.BAD_REQUEST);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of wrong photo id', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoDeleteResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoDeleteResponse.status).toBe(HttpStatus.OK);

      const locationCreationResponse1 = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse1.status).toBe(HttpStatus.BAD_REQUEST);

      const locationCreationResponse2 = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: 'not a number',
      });
      expect(locationCreationResponse2.status).toBe(HttpStatus.BAD_REQUEST);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);
    });
  });

  describe('DELETE', () => {
    it('should delete entity correctly', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const deleteLocationResponse = await request.delete(
        locationRoutes.delete(locationCreationResponse.body.id),
      );
      expect(deleteLocationResponse.status).toBe(HttpStatus.OK);

      const checkDeleteLocationResponse = await request.get(
        locationRoutes.findById(locationCreationResponse.body.id),
      );
      expect(checkDeleteLocationResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(checkDeleteLocationResponse.body.message).toBe(ExceptionMessages.LOCATION_NOT_FOUND);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return NOT_FOUND in case of wrong id', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const deleteLocationResponse1 = await request.delete(
        locationRoutes.delete(locationCreationResponse.body.id),
      );
      expect(deleteLocationResponse1.status).toBe(HttpStatus.OK);

      const deleteLocationResponse2 = await request.delete(
        locationRoutes.delete(locationCreationResponse.body.id),
      );
      expect(deleteLocationResponse2.status).toBe(HttpStatus.NOT_FOUND);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of invalid id format', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const deleteLocationResponse = await request.delete(locationRoutes.delete('Not a number'));
      expect(deleteLocationResponse.status).toBe(HttpStatus.BAD_REQUEST);

      const cleanupLocationResponse = await request.delete(
        locationRoutes.delete(locationCreationResponse.body.id),
      );
      expect(cleanupLocationResponse.status).toBe(HttpStatus.OK);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);
    });
  });
});
