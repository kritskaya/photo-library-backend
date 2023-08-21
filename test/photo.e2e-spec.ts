import { HttpStatus } from '@nestjs/common';
import { join } from 'path';
import { UPLOAD_PATH } from '../src/common/constants';
import { ExceptionMessages } from '../src/common/messages';
import { fileExists, getFileSize } from '../src/common/utils/fs.utils';
import { albumRoutes, locationRoutes, photosRoutes } from './endpoints';
import {
  createPhoto,
  createPhotoDto,
  request,
  TEST_FILE_PATH,
  TEST_FOLDER,
  TEST_PHOTO_FILENAME,
} from './testUtils';

const createAlbumDto = {
  name: 'Album Name',
};

describe('Photo Controller', () => {
  describe('GET', () => {
    it('should get photos', async () => {
      const response = await request.get(photosRoutes.findMany);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body).toHaveProperty('totalCount');
    });

    it('should get photos from specified page with specified perPage value', async () => {
      const response = await request.get(photosRoutes.findMany);
      expect(response.status).toBe(HttpStatus.OK);

      const { totalCount } = response.body;

      const creationResponse1 = await request
        .post(photosRoutes.create)
        .set('Content-Type', 'multipart/form-data')
        .field('officialID', 'US-1111111')
        .attach('file', TEST_FILE_PATH);
      expect(creationResponse1.status).toBe(HttpStatus.CREATED);

      const creationResponse2 = await createPhoto();
      expect(creationResponse2.status).toBe(HttpStatus.CREATED);

      const perPageResponse = await request.get(`/photos?page=${totalCount}&perPage=1`);
      expect(perPageResponse.status).toBe(HttpStatus.OK);
      expect(perPageResponse.body.data).toHaveLength(1);
      expect(perPageResponse.body.data[0].officialID).toBe('US-1111111');

      const cleanupResponse1 = await request.delete(photosRoutes.delete(creationResponse1.body.id));
      expect(cleanupResponse1.status).toBe(HttpStatus.OK);
      const cleanupResponse2 = await request.delete(photosRoutes.delete(creationResponse2.body.id));
      expect(cleanupResponse2.status).toBe(HttpStatus.OK);
    });

    it('should get photo by id', async () => {
      const creationResponse = await createPhoto();
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const getResponse = await request.get(photosRoutes.findOne(id));
      expect(getResponse.status).toBe(HttpStatus.OK);

      const cleanupResponse = await request.delete(photosRoutes.delete(id));
      expect(cleanupResponse.status).toBe(HttpStatus.OK);

      const getInvalidIdResponse = await request.get(photosRoutes.findOne(id));

      expect(getInvalidIdResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(getInvalidIdResponse.body.message).toBe(ExceptionMessages.PHOTO_NOT_FOUND);
    });

    it('should return BAD_REQUEST in case of invalid id', async () => {
      const getInvalidIdResponse = await request.get(photosRoutes.findOne('abc'));

      expect(getInvalidIdResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST', () => {
    it('should create new entity correctly', async () => {
      const creationResponse = await createPhoto();
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const getResponse = await request.get(photosRoutes.findOne(id));

      expect(getResponse.status).toBe(HttpStatus.OK);
      expect(getResponse.body.id).toBe(id);
      expect(getResponse.body.path).not.toBeNull();
      expect(getResponse.body.officialID).toBe('BY-1234567');
      expect(getResponse.body.fromGroup).toBe('Russian RR');
      expect(getResponse.body.fromPerson).toBe('UserName');
      expect(getResponse.body.description).toBe('photo description');

      const cleanupResponse = await request.delete(photosRoutes.delete(id));

      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of invalid data', async () => {
      const response1 = await request
        .post(photosRoutes.create)
        .set('Content-Type', 'multipart/form-data')
        .field('receivedAt', '123abc')
        .attach('file', TEST_FILE_PATH);

      expect(response1.status).toBe(HttpStatus.BAD_REQUEST);

      const response2 = await request
        .post(photosRoutes.create)
        .set('Content-Type', 'multipart/form-data')
        .field('officialID', '1234567')
        .attach('file', TEST_FILE_PATH);

      expect(response2.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should upload photo when entity was creating', async () => {
      const creationResponse = await createPhoto();

      const { id } = creationResponse.body;
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const filePath = join(UPLOAD_PATH, creationResponse.body.path);
      expect(await fileExists(filePath)).toBe(true);
      expect(await getFileSize(filePath)).toBe(await getFileSize(TEST_FILE_PATH));

      const cleanupResponse = await request.delete(photosRoutes.delete(id));
      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return UNPROCESSABLE_ENTITY if file has wrong extension', async () => {
      const TEST_FILE_PATH2 = join(TEST_FOLDER, 'test.jpp');

      const creationResponse = await request
        .post(photosRoutes.create)
        .set('Content-Type', 'multipart/form-data')
        .field('receivedAt', createPhotoDto.receivedAt)
        .field('officialID', createPhotoDto.officialID)
        .field('fromGroup', createPhotoDto.fromGroup)
        .field('fromPerson', createPhotoDto.fromPerson)
        .field('description', createPhotoDto.description)
        .attach('file', TEST_FILE_PATH2);

      const { id } = creationResponse.body;
      expect(creationResponse.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return BAD_REQUEST if file has not been attached', async () => {
      const creationResponse = await request
        .post(photosRoutes.create)
        .set('Content-Type', 'multipart/form-data')
        .field('receivedAt', createPhotoDto.receivedAt)
        .field('officialID', createPhotoDto.officialID)
        .field('fromGroup', createPhotoDto.fromGroup)
        .field('fromPerson', createPhotoDto.fromPerson)
        .field('description', createPhotoDto.description);

      expect(creationResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT', () => {
    it('should update entity correctly', async () => {
      const creationResponse = await createPhoto();
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const updateResponse1 = await request.put(photosRoutes.update(id)).send({
        receivedAt: '2023-06-27T13:08:16.833Z',
        officialID: 'BY-1234568',
        fromGroup: 'Russian RR1',
        fromPerson: 'UserName1',
        description: 'photo description1',
      });

      expect(updateResponse1.status).toBe(HttpStatus.OK);
      expect(updateResponse1.body.id).toBe(id);
      expect(updateResponse1.body.path).toBe(creationResponse.body.path);
      expect(updateResponse1.body.receivedAt).toBe('2023-06-27T13:08:16.833Z');
      expect(updateResponse1.body.officialID).toBe('BY-1234568');
      expect(updateResponse1.body.fromGroup).toBe('Russian RR1');
      expect(updateResponse1.body.fromPerson).toBe('UserName1');
      expect(updateResponse1.body.description).toBe('photo description1');

      const updateResponse2 = await request.put(photosRoutes.update(id)).send({
        description: 'photo description2',
      });

      expect(updateResponse2.status).toBe(HttpStatus.OK);
      expect(updateResponse2.body.id).toBe(id);
      expect(updateResponse2.body.path).toBe(creationResponse.body.path);
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

    it('should return BAD_REQUEST in case of empty payload', async () => {
      const creationResponse = await createPhoto();
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const updateResponse = await request.put(photosRoutes.update(id)).send({});
      expect(updateResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(updateResponse.body.message).toBe(ExceptionMessages.EMPTY_PAYLOAD);

      const cleanupResponse = await request.delete(photosRoutes.delete(id));
      expect(cleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should return BAD_REQUEST in case of invalid payload data', async () => {
      const creationResponse = await createPhoto();
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

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

    it('should return BAD_REQUEST in case of invalid id', async () => {
      const getInvalidIdResponse = await request.put(photosRoutes.update('abc'));
      expect(getInvalidIdResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE', () => {
    it('should delete photo and album covers with this photo if exist', async () => {
      const creationResponse = await createPhoto();
      const { id } = creationResponse.body;
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const createAlbumDto = {
        name: 'Album Name',
        coverId: id,
      };

      const createAlbumResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(createAlbumResponse.status).toBe(HttpStatus.CREATED);
      expect(createAlbumResponse.body.coverId).toBe(id);

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

    it('should delete locations with photo when this photo was deleted', async () => {
      const albumCreationResponse = await request.post(albumRoutes.create).send(createAlbumDto);
      expect(albumCreationResponse.status).toBe(HttpStatus.CREATED);

      const photoCreationResponse = await createPhoto();
      expect(photoCreationResponse.status).toBe(HttpStatus.CREATED);

      const locationCreationResponse = await request.post(locationRoutes.create).send({
        albumId: albumCreationResponse.body.id,
        photoId: photoCreationResponse.body.id,
      });
      expect(locationCreationResponse.status).toBe(HttpStatus.CREATED);

      const deletePhotoResponse = await request.delete(
        photosRoutes.delete(photoCreationResponse.body.id),
      );
      expect(deletePhotoResponse.status).toBe(HttpStatus.OK);

      const locationResponse = await request.get(
        locationRoutes.findById(locationCreationResponse.body.id),
      );
      expect(locationResponse.status).toBe(HttpStatus.NOT_FOUND);

      const albumCleanupResponse = await request.delete(
        albumRoutes.delete(albumCreationResponse.body.id),
      );
      expect(albumCleanupResponse.status).toBe(HttpStatus.OK);
    });

    it('should delete photo file after entity was deleted', async () => {
      const creationResponse = await createPhoto();
      expect(creationResponse.status).toBe(HttpStatus.CREATED);

      const { id } = creationResponse.body;

      const isFileExists = await fileExists(join(UPLOAD_PATH, creationResponse.body.path));
      expect(isFileExists).toBe(true);

      const deleteResponse = await request.delete(photosRoutes.delete(id));
      expect(deleteResponse.status).toBe(HttpStatus.OK);

      const isFileExists2 = await fileExists(join(UPLOAD_PATH, TEST_PHOTO_FILENAME));
      expect(isFileExists2).toBe(false);
    });

    it('should return BAD_REQUEST in case of invalid id', async () => {
      const getInvalidIdResponse = await request.delete(photosRoutes.delete('abc'));

      expect(getInvalidIdResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
