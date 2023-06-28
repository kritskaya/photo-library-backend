import { diskStorage } from 'multer';
import { extname } from 'path';
import { UPLOAD_PATH } from 'src/common/constants';

export const storage = diskStorage({
  destination: UPLOAD_PATH,
  filename: (req, file, callback) => {
    const name = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
    callback(null, `${name}${extname(file.originalname)}`);
  },
});
