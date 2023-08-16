import { HttpStatus } from '@nestjs/common';
import { albumRoutes, collectionRoutes, locationRoutes, photosRoutes } from './endpoints';
import { createPhoto, request } from './testUtils';

const createCollectionDto = {
  name: 'Collection Name',
};

describe('Collection Controller', () => {
  describe('GET', () => {
    it('should get all collections', async () => {
      const response = await request.get(collectionRoutes.findMany);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should get collection by id', async () => {
      const creationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const cleanupResponse = await request.delete(
        collectionRoutes.delete(creationResponse.body.id),
      );
      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of invalid id', async () => {
      const response = await request.get(collectionRoutes.findOne('abc'));

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return NOT_FOUND in case of wrong id', async () => {
      const creationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const deleteResponse = await request.delete(
        collectionRoutes.delete(creationResponse.body.id),
      );
      expect(deleteResponse.status).toBe(HttpStatus.OK);

      const checkResponse = await request.get(collectionRoutes.findOne(creationResponse.body.id));
      expect(checkResponse.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST', () => {
    it('should create new entity correctly', async () => {
      const creationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);
      expect(creationResponse.body.name).toBe(createCollectionDto.name);

      const cleanupResponse = await request.delete(
        collectionRoutes.delete(creationResponse.body.id),
      );
      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of absense of required fields', async () => {
      const creationResponse = await request.post(collectionRoutes.create).send({});
      expect(creationResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT', () => {
    it('should update entity correctly', async () => {
      const creationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const updateResponse = await request
        .put(collectionRoutes.update(id))
        .send({ name: 'New Name' });
      expect(updateResponse.status).toBe(HttpStatus.OK);
      expect(updateResponse.body.name).toBe('New Name');

      const cleanupResponse = await request.delete(
        collectionRoutes.delete(creationResponse.body.id),
      );
      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of invalid id', async () => {
      const response = await request.put(collectionRoutes.update('abc')).send({ name: 'New Name' });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return NOT_FOUND in case of wrong id', async () => {
      const creationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const deleteResponse = await request.delete(collectionRoutes.delete(id));
      expect(deleteResponse.status).toBe(HttpStatus.OK);

      const updateResponse = await request
        .put(collectionRoutes.update(id))
        .send({ name: 'New Name' });
      expect(updateResponse.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return BAD_REQUEST in case of absense of required fields', async () => {
      const creationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const updateResponse = await request.put(collectionRoutes.update(id)).send({});
      expect(updateResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE', () => {
    it('should delete entity', async () => {
      const creationResponse = await request
        .post(collectionRoutes.create)
        .send(createCollectionDto);
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const deleteResponse = await request.delete(
        collectionRoutes.delete(creationResponse.body.id),
      );
      expect(deleteResponse.status).toBe(HttpStatus.OK);

      const checkDeleteResponse = await request.get(
        collectionRoutes.findOne(creationResponse.body.id),
      );
      expect(checkDeleteResponse.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  it('should return BAD_REQUEST in case of invalid id', async () => {
    const response = await request.delete(collectionRoutes.delete('abc'));

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return NOT_FOUND in case of wrong id', async () => {
    const creationResponse = await request.post(collectionRoutes.create).send(createCollectionDto);
    expect(creationResponse.status).toBe(HttpStatus.CREATED);

    const { id } = creationResponse.body;

    const deleteResponse1 = await request.delete(collectionRoutes.delete(id));
    expect(deleteResponse1.status).toBe(HttpStatus.OK);

    const deleteResponse2 = await request.delete(collectionRoutes.delete(id));
    expect(deleteResponse2.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should delete albums, photos and locations from deleted collection', async () => {
    const collectionCreationResponse = await request
      .post(collectionRoutes.create)
      .send(createCollectionDto);
    expect(collectionCreationResponse.status).toBe(HttpStatus.CREATED);

    const albumCreationResponse = await request.post(albumRoutes.create).send({
      name: 'Album Name',
      collectionId: collectionCreationResponse.body.id,
    });
    expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

    const photoCreationResponse = await createPhoto();
    expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

    const locationCreationResponse = await request.post(locationRoutes.create).send({
      albumId: albumCreationResponse.body.id,
      photoId: photoCreationResponse.body.id,
    });
    expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

    const collectionDeleteResponse = await request.delete(
      collectionRoutes.delete(collectionCreationResponse.body.id),
    );
    expect(collectionDeleteResponse.status).toBe(HttpStatus.OK);

    const checkAlbumResponse = await request.get(
      albumRoutes.findOne(albumCreationResponse.body.id),
    );
    expect(checkAlbumResponse.status).toBe(HttpStatus.NOT_FOUND);

    const checkPhotoResponse = await request.get(
      photosRoutes.findOne(photoCreationResponse.body.id),
    );
    expect(checkPhotoResponse.status).toBe(HttpStatus.NOT_FOUND);

    const checkLocationResponse = await request.get(
      locationRoutes.findById(locationCreationResponse.body.id),
    );
    expect(checkLocationResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('should not delete photos if they located not only in deleted collection', async () => {
    const collectionCreationResponse = await request
      .post(collectionRoutes.create)
      .send(createCollectionDto);
    expect(collectionCreationResponse.status).toBe(HttpStatus.CREATED);

    const albumCreationResponse1 = await request.post(albumRoutes.create).send({
      name: 'Album Name1',
      collectionId: collectionCreationResponse.body.id,
    });
    expect(albumCreationResponse1.status).toBe(HttpStatus.CREATED);

    const photoCreationResponse = await createPhoto();
    expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

    const locationCreationResponse1 = await request.post(locationRoutes.create).send({
      albumId: albumCreationResponse1.body.id,
      photoId: photoCreationResponse.body.id,
    });
    expect(locationCreationResponse1.status).toBe(HttpStatus.CREATED);

    const albumCreationResponse2 = await request.post(albumRoutes.create).send({
      name: 'Album Name2',
    });
    expect(albumCreationResponse2.status).toBe(HttpStatus.CREATED);

    const locationCreationResponse2 = await request.post(locationRoutes.create).send({
      albumId: albumCreationResponse2.body.id,
      photoId: photoCreationResponse.body.id,
    });
    expect(locationCreationResponse2.status).toBe(HttpStatus.CREATED);

    const collectionDeleteResponse = await request.delete(
      collectionRoutes.delete(collectionCreationResponse.body.id),
    );
    expect(collectionDeleteResponse.status).toBe(HttpStatus.OK);

    const checkAlbumResponse = await request.get(
      albumRoutes.findOne(albumCreationResponse1.body.id),
    );
    expect(checkAlbumResponse.status).toBe(HttpStatus.NOT_FOUND);

    const checkPhotoResponse = await request.get(
      photosRoutes.findOne(photoCreationResponse.body.id),
    );
    expect(checkPhotoResponse.status).toBe(HttpStatus.OK);

    const cleanupAlbumCreationResponse2 = await request.delete(
      albumRoutes.delete(albumCreationResponse2.body.id),
    );
    expect(cleanupAlbumCreationResponse2.status).toBe(HttpStatus.OK);
  });
});
