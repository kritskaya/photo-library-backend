export enum ExceptionMessages {
  COLLECTION_NOT_FOUND = 'Collection with such id is not found',
  ALBUM_NOT_FOUND = 'Album with such id is not found',
  PHOTO_NOT_FOUND = 'Photo with such id is not found',

  LOCATION_NOT_FOUND = 'Location with such id is not found',
  LOCATION_EXISTS = 'Location with such album and photo id has already exist',

  INVALID_PATH = 'File with specified path is not found',
  EMPTY_PAYLOAD = 'Payload should not be empty',
}
