const multer = require('multer');
const path = require('path');

module.exports = {
  storage: multer.diskStorage({
    destination: (req, _, cb) => {
      const filepath = `${path.resolve(__dirname, '..', '..', 'uploads')}${
        req.url
      }`;

      cb(null, filepath);
    },
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);

      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
};
