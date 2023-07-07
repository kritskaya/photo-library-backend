import { HttpStatus } from '@nestjs/common';
import * as req from 'supertest';
import { ExceptionMessages } from '../src/common/messages';
import { albumRoutes, photosRoutes } from './endpoints';

const createPhotoDto = {
  path: 'path',
  receivedAt: '2023-06-26T13:08:16.833Z',
  officialID: 'BY-1234567',
  fromGroup: 'Russian RR',
  fromPerson: 'UserName',
  description: 'photo description',
};

describe('Photo Controller', () => {
  const request = req('localhost:3000');

  describe('GET', () => {
    it('should get all photos', async () => {
      const response = await request.get(photosRoutes.findMany);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body).toHaveProperty('totalCount');
    });

    it('should get photo by id', async () => {
      const creationResponse = await request.post(photosRoutes.create).send(createPhotoDto);

      const { id } = creationResponse.body;

      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const getResponse = await request.get(photosRoutes.findOne(id));

      expect(getResponse.status).toBe(HttpStatus.OK);

      const cleanupResponse = await request.delete(photosRoutes.delete(id));

      expect(cleanupResponse.status).toBe(HttpStatus.OK);

      const getInvalidIdResponse = await request.get(photosRoutes.findOne(id));

      expect(getInvalidIdResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(getInvalidIdResponse.body.message).toBe(ExceptionMessages.PHOTO_NOT_FOUND);
    });
  });

  describe('POST', () => {
    it('should create new entity correctly', async () => {
      const creationResponse = await request.post(photosRoutes.create).send(createPhotoDto);

      const { id } = creationResponse.body;

      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const getResponse = await request.get(photosRoutes.findOne(id));

      expect(getResponse.status).toBe(HttpStatus.OK);
      expect(getResponse.body.id).toBe(id);
      expect(getResponse.body.path).toBe('path');
      expect(getResponse.body.officialID).toBe('BY-1234567');
      expect(getResponse.body.fromGroup).toBe('Russian RR');
      expect(getResponse.body.fromPerson).toBe('UserName');
      expect(getResponse.body.description).toBe('photo description');

      const cleanupResponse = await request.delete(photosRoutes.delete(id));

      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of invalid data', async () => {
      const response1 = await request.post(photosRoutes.create).send({
        receivedAt: '2023-06-26T13:08:16.833Z',
      });

      expect(response1.status).toBe(HttpStatus.BAD_REQUEST);

      const response2 = await request.post(photosRoutes.create).send({
        path: null,
        receivedAt: '2023-06-26T13:08:16.833Z',
      });

      expect(response2.status).toBe(HttpStatus.BAD_REQUEST);

      const response3 = await request.post(photosRoutes.create).send({
        receivedAt: '123',
      });

      expect(response3.status).toBe(HttpStatus.BAD_REQUEST);

      const response4 = await request.post(photosRoutes.create).send({
        officialID: '1234567',
      });

      expect(response4.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT', () => {
    it('should update entity correctly', async () => {
      const creationResponse = await request.post(photosRoutes.create).send(createPhotoDto);

      const { id } = creationResponse.body;

      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const updateResponse1 = await request.put(photosRoutes.update(id)).send({
        path: 'path1',
        receivedAt: '2023-06-27T13:08:16.833Z',
        officialID: 'BY-1234568',
        fromGroup: 'Russian RR1',
        fromPerson: 'UserName1',
        description: 'photo description1',
      });

      expect(updateResponse1.status).toBe(HttpStatus.OK);
      expect(updateResponse1.body.id).toBe(id);
      expect(updateResponse1.body.path).toBe('path');
      expect(updateResponse1.body.receivedAt).toBe('2023-06-27T13:08:16.833Z');
      expect(updateResponse1.body.officialID).toBe('BY-1234568');
      expect(updateResponse1.body.fromGroup).toBe('Russian RR1');
      expect(updateResponse1.body.fromPerson).toBe('UserName1');
      expect(updateResponse1.body.description).toBe('photo description1');

      const updateResponse2 = await request.put(photosRoutes.update(id)).send({
        path: 'path2',
        description: 'photo description2',
      });

      expect(updateResponse2.status).toBe(HttpStatus.OK);
      expect(updateResponse2.body.id).toBe(id);
      expect(updateResponse2.body.path).toBe('path');
      expect(updateResponse2.body.receivedAt).toBe('2023-06-27T13:08:16.833Z');
      expect(updateResponse2.body.officialID).toBe('BY-1234568');
      expect(updateResponse2.body.fromGroup).toBe('Russian RR1');
      expect(updateResponse2.body.fromPerson).toBe('UserName1');
      expect(updateResponse2.body.description).toBe('photo description2');

      const cleanupResponse = await request.delete(photosRoutes.delete(id));

      expect(cleanupResponse.status).toBe(HttpStatus.OK);

      const checkCleanupResponse = await request.put(photosRoutes.update(id)).send({
        description: 'photo description3',
      });

      expect(checkCleanupResponse.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return BAD_REQUEST in case of invalid data', async () => {
      const creationResponse = await request.post(photosRoutes.create).send(createPhotoDto);

      const { id } = creationResponse.body;

      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const updateResponse1 = await request.put(photosRoutes.update(id)).send({
        receivedAt: '1234-4545lk',
      });

      expect(updateResponse1.status).toBe(HttpStatus.BAD_REQUEST);

      const updateResponse2 = await request.put(photosRoutes.update(id)).send({
        officialID: '1234567',
      });

      expect(updateResponse2.status).toBe(HttpStatus.BAD_REQUEST);

      const cleanupResponse = await request.delete(photosRoutes.delete(id));

      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });
  });

  describe('DELETE', () => {
    it('should delete photo and album covers with this photo if exist', async () => {
      const creationResponse = await request.post(photosRoutes.create).send(createPhotoDto);
      const { id } = creationResponse.body;
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const createAlbumDto = {
        name: 'Album Name',
        coverId: id,
      };

      const createAlbumResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(createAlbumResponse.status).toBe(HttpStatus.CREATED);

      const deleteResponse = await request.delete(photosRoutes.delete(id));
      expect(deleteResponse.status).toBe(HttpStatus.OK);

      const checkDeleteResponse = await request.get(photosRoutes.findOne(id));
      expect(checkDeleteResponse.status).toBe(HttpStatus.NOT_FOUND);

      const checkDeleteCoverResponse = await request.get(
        albumRoutes.findOne(createAlbumResponse.body.id),
      );
      expect(checkDeleteCoverResponse.status).toBe(HttpStatus.OK);
      expect(checkDeleteCoverResponse.body.coverId).toBeNull();

      const invalidIdDeleteResponse = await request.delete(photosRoutes.delete(id));
      expect(invalidIdDeleteResponse.status).toBe(HttpStatus.NOT_FOUND);

      const cleanupAlbumResponse = await request.delete(
        albumRoutes.delete(createAlbumResponse.body.id),
      );
      expect(cleanupAlbumResponse.status).toBe(HttpStatus.OK);
    });
  });
});
