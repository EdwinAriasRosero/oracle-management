import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Create a unique filename with the original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      cb(null, `${file.originalname}-${uniqueSuffix}${fileExtension}`);
    },
  }),
};
