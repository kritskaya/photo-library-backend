import * as req from 'supertest';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { photosRoutes } from './endpoints';

export const createPhotoDto = {
  receivedAt: '2023-06-26T13:08:16.833Z',
  officialID: 'BY-1234567',
  fromGroup: 'Russian RR',
  fromPerson: 'UserName',
  description: 'photo description',
};

export const TEST_PHOTO_FILENAME = 'test.jpg';
export const TEST_FOLDER = 'test';
export const TEST_FILE_PATH = join(TEST_FOLDER, TEST_PHOTO_FILENAME);

dotenv.config();
const port = process.env.PORT || 3000;
export const request = req(`localhost:${port}`);

export const createPhoto = () => {
  const creationResponse = request
    .post(photosRoutes.create)
    .set('Content-Type', 'multipart/form-data')
    .field('receivedAt', createPhotoDto.receivedAt)
    .field('officialID', createPhotoDto.officialID)
    .field('fromGroup', createPhotoDto.fromGroup)
    .field('fromPerson', createPhotoDto.fromPerson)
    .field('description', createPhotoDto.description)
    .attach('file', TEST_FILE_PATH);
  return creationResponse;
};
