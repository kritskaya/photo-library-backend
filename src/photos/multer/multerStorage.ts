import { diskStorage } from 'multer';
import { extname } from 'path';
import { UPLOAD_PATH } from '../../common/constants';
import { getFileName } from '../../common/utils/upload.utils';

export const storage = diskStorage({
  destination: UPLOAD_PATH,
  filename: (req, file, callback) => {
    const name = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
    const fileName = `${name}${extname(file.originalname)}`;
    callback(null, getFileName(fileName, Number(req.params.id)));
  },
});
