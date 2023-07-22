import { diskStorage } from 'multer';
import { UPLOAD_PATH } from '../../common/constants';
import { getUniqueFileName } from '../../common/utils/upload.utils';

export const storage = diskStorage({
  destination: UPLOAD_PATH,
  filename: (_req, file, callback) => {
    callback(null, getUniqueFileName(file.originalname));
  },
});
