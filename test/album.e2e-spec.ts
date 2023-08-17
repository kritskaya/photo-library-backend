import { HttpStatus } from '@nestjs/common';
import { ExceptionMessages } from '../src/common/messages';
import { albumRoutes, collectionRoutes, locationRoutes, photosRoutes } from './endpoints';
import { createPhoto, request } from './testUtils';

const createAlbumDto = {
  name: 'Album Name',
};

const createCollectionDto = {
  name: 'Collection Name',
};

describe('Album Controller', () => {
  describe('GET', () => {
    it('should return all albums', async () => {
      const response = await request.get(albumRoutes.findMany);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body).toHaveProperty('totalCount');
    });

    it('should return album by id correctly', async () => {
      const creationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const getResponse = await request.get(albumRoutes.findOne(id));
      expect(getResponse.status).toBe(HttpStatus.OK);

      const cleanupResponse = await request.delete(albumRoutes.delete(id));
      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should get albums from specified page with specified perPage value', async () => {
      const response = await request.get(albumRoutes.findMany);
      expect(response.status).toBe(HttpStatus.OK);

      const { totalCount } = response.body;

      const creationResponse1 = await request.post(albumRoutes.create).send({
        name: 'Specific Album Name',
      });
      expect(creationResponse1.status).toBe(HttpStatus.CREATED);

      const creationResponse2 = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(creationResponse2.status).toBe(HttpStatus.CREATED);

      const perPageResponse = await request.get(`/albums?page=${totalCount}&perPage=1`);
      expect(perPageResponse.status).toBe(HttpStatus.OK);
      expect(perPageResponse.body.data).toHaveLength(1);
      expect(perPageResponse.body.data[0].name).toBe('Specific Album Name');

      const cleanupResponse1 = await request.delete(albumRoutes.delete(creationResponse1.body.id));
      expect(cleanupResponse1.status).toBe(HttpStatus.OK);
      const cleanupResponse2 = await request.delete(albumRoutes.delete(creationResponse2.body.id));
      expect(cleanupResponse2.status).toBe(HttpStatus.OK);
    });

    it('should return NOT_FOUND in case of invalid album id', async () => {
      const creationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const cleanupResponse = await request.delete(albumRoutes.delete(id));
      expect(cleanupResponse.status).toBe(HttpStatus.OK);

      const checkCleanupResponse = await request.get(albumRoutes.findOne(id));
      expect(checkCleanupResponse.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST', () => {
    it('should create album correctly', async () => {
      const collectionCreationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(collectionCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const albumCreationResponse = await request.post(albumRoutes.create).send({
        ...createAlbumDto,
        collectionId: collectionCreationResponse.body.id,
        coverId: photoCreationResponse.body.id,
      });
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const checkCreationResponse = await request.get(albumRoutes.findOne(id));
      expect(checkCreationResponse.status).toBe(HttpStatus.OK);
      expect(checkCreationResponse.body.name).toBe('Album Name');
      expect(checkCreationResponse.body.coverId).toBe(photoCreationResponse.body.id);
      expect(checkCreationResponse.body.collectionId).toBe(collectionCreationResponse.body.id);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);

      const collectionCleanupResponse = await request.delete(
        collectionRoutes.delete(collectionCreationResponse.body.id),
      );
      expect(collectionCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of absence of required field', async () => {
      const collectionCreationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(collectionCreationResponse.status).toBe(HttpStatus.CREATED);

      const albumCreationResponse = await request.post(albumRoutes.create).send({
        collectionId: collectionCreationResponse.body.id,
      });
      expect(albumCreationResponse.status).toBe(HttpStatus.BAD_REQUEST);

      const collectionCleanupResponse = await request.delete(
        collectionRoutes.delete(collectionCreationResponse.body.id),
      );
      expect(collectionCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of wrong collection id', async () => {
      const collectionCreationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(collectionCreationResponse.status).toBe(HttpStatus.CREATED);

      const collectionDeleteResponse = await request.delete(
        collectionRoutes.delete(collectionCreationResponse.body.id),
      );
      expect(collectionDeleteResponse.status).toBe(HttpStatus.OK);

      const albumCreationResponse = await request.post(albumRoutes.create).send({
        ...createAlbumDto,
        collectionId: collectionCreationResponse.body.id,
      });
      expect(albumCreationResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(albumCreationResponse.body.message).toBe(ExceptionMessages.COLLECTION_NOT_FOUND);

      const albumCreationResponse2 = await request.post(albumRoutes.create).send({
        ...createAlbumDto,
        collectionId: 'not a number',
      });
      expect(albumCreationResponse2.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return BAD_REQUEST in case of wrong cover id', async () => {
      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoDeleteResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoDeleteResponse.status).toBe(HttpStatus.OK);

      const albumCreationResponse = await request.post(albumRoutes.create).send({
        ...createAlbumDto,
        coverId: photoCreationResponse.body.id,
      });
      expect(albumCreationResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(albumCreationResponse.body.message).toBe(ExceptionMessages.PHOTO_NOT_FOUND);

      const albumCreationResponse2 = await request.post(albumRoutes.create).send({
        ...createAlbumDto,
        coverId: 'not a number',
      });
      expect(albumCreationResponse2.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT', () => {
    it('should update album data correctly', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const collectionCreationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(collectionCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const albumUpdateResponse = await request.put(albumRoutes.update(id)).send({
        name: 'New Album Name',
        coverId: photoCreationResponse.body.id,
        collectionId: collectionCreationResponse.body.id,
      });
      expect(albumUpdateResponse.status).toBe(HttpStatus.OK);
      expect(albumUpdateResponse.body.name).toBe('New Album Name');
      expect(albumUpdateResponse.body.coverId).toBe(photoCreationResponse.body.id);
      expect(albumUpdateResponse.body.collectionId).toBe(collectionCreationResponse.body.id);

      const photoCleanupResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoCleanupResponse.status).toBe(HttpStatus.OK);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);

      const collectionCleanupResponse = await request.delete(
        collectionRoutes.delete(collectionCreationResponse.body.id),
      );
      expect(collectionCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of empty payload', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const albumUpdateResponse = await request.put(albumRoutes.update(id)).send({});
      expect(albumUpdateResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(albumUpdateResponse.body.message).toBe(ExceptionMessages.EMPTY_PAYLOAD);

      const cleanupAlbumResponse = await request.delete(albumRoutes.delete(id));
      expect(cleanupAlbumResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of wrong collection id', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const collectionCreationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(collectionCreationResponse.status).toBe(HttpStatus.CREATED);

      const collectionDeleteResponse = await request.delete(
        collectionRoutes.delete(collectionCreationResponse.body.id),
      );
      expect(collectionDeleteResponse.status).toBe(HttpStatus.OK);

      const albumUpdateResponse = await request.put(albumRoutes.update(id)).send({
        collectionId: collectionCreationResponse.body.id,
      });
      expect(albumUpdateResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(albumUpdateResponse.body.message).toBe(ExceptionMessages.COLLECTION_NOT_FOUND);

      const albumUpdateResponse2 = await request.put(albumRoutes.update(id)).send({
        ...createAlbumDto,
        collectionId: 'not a number',
      });
      expect(albumUpdateResponse2.status).toBe(HttpStatus.BAD_REQUEST);

      const cleanupAlbumResponse = await request.delete(albumRoutes.delete(id));
      expect(cleanupAlbumResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case wrong cover id', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoDeleteResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(photoDeleteResponse.status).toBe(HttpStatus.OK);

      const albumUpdateResponse = await request.put(albumRoutes.update(id)).send({
        coverId: photoCreationResponse.body.id,
      });
      expect(albumUpdateResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(albumUpdateResponse.body.message).toBe(ExceptionMessages.PHOTO_NOT_FOUND);

      const albumUpdateResponse2 = await request.put(albumRoutes.update(id)).send({
        coverId: 'Not a number',
      });
      expect(albumUpdateResponse2.status).toBe(HttpStatus.BAD_REQUEST);

      const cleanupAlbumResponse = await request.delete(albumRoutes.delete(id));
      expect(cleanupAlbumResponse.status).toBe(HttpStatus.OK);
    });
  });

  describe('DELETE', () => {
    it('should delete album entity', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const deleteAlbumResponse = await request.delete(albumRoutes.delete(id));
      expect(deleteAlbumResponse.status).toBe(HttpStatus.OK);

      const checkDeleteResponse = await request.get(albumRoutes.findOne(id));
      expect(checkDeleteResponse.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return NOT_FOUND in case of wrong id', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const deleteAlbumResponse = await request.delete(albumRoutes.delete(id));
      expect(deleteAlbumResponse.status).toBe(HttpStatus.OK);

      const deleteAlbumResponse2 = await request.delete(albumRoutes.delete(id));
      expect(deleteAlbumResponse2.status).toBe(HttpStatus.NOT_FOUND);
      expect(deleteAlbumResponse2.body.message).toBe(ExceptionMessages.ALBUM_NOT_FOUND);
    });

    it('should return BAD_REQUEST in case of invalid id format', async () => {
      const deleteAlbumResponse = await request.delete(albumRoutes.delete('not a number'));
      expect(deleteAlbumResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should delete locations and photos from deleted album if they located only in deleted album', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const deleteAlbumResponse = await request.delete(albumRoutes.delete(id));
      expect(deleteAlbumResponse.status).toBe(HttpStatus.OK);

      const checkDeletePhoto = await request.get(
        photosRoutes.findOne(photoCreationResponse.body.id),
      );
      expect(checkDeletePhoto.status).toBe(HttpStatus.NOT_FOUND);

      const checkDeleteLocation = await request.get(locationRoutes.findByAlbum(id));
      expect(checkDeleteLocation.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should not delete photos from deleted album if they located in other albums', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = albumCreationResponse.body;

      const albumCreationResponse2 = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse2.status).toBe(HttpStatus.CREATED);

      const { id: id2 } = albumCreationResponse2.body;

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse2 = await request.post(locationRoutes.create).send({
        albumId: id2,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse2.status).toBe(HttpStatus.CREATED);

      const deleteAlbumResponse = await request.delete(albumRoutes.delete(id));
      expect(deleteAlbumResponse.status).toBe(HttpStatus.OK);

      const checkPhotoResponse = await request.get(
        photosRoutes.findOne(photoCreationResponse.body.id),
      );
      expect(checkPhotoResponse.status).toBe(HttpStatus.OK);

      const album2DeleteResponse = await request.delete(albumRoutes.delete(id2));
      expect(album2DeleteResponse.status).toBe(HttpStatus.OK);

      const checkPhotoAfterAlbumDeleteResponse = await request.get(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(checkPhotoAfterAlbumDeleteResponse.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
