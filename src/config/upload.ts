import multer from 'multer';
import path from 'path';

export default (folder: string) => ({
  storage: multer.diskStorage({
    destination: (req, _, cb) => {
      const filepath = path.resolve(__dirname, '..', '..', 'uploads', folder);

      cb(null, filepath);
    },
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);

      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
});
