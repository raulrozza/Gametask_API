import multer from 'multer';
import path from 'path';

const uploadsPath = path.resolve(__dirname, '..', '..', 'uploads');
const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  uploadsPath,
  tmpPath,

  multerConfig: {
    storage: multer.diskStorage({
      destination: (req, _, cb) => cb(null, uploadsPath),
      filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);

        cb(null, `${name}-${Date.now()}${ext}`);
      },
    }),
  },
};
