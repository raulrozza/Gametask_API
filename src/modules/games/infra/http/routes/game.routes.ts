import express from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { GameController } from '@modules/games/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

const gameController = new GameController();

const gameRoutes = express.Router();
const upload = multer(uploadConfig.multerConfig);

gameRoutes.post(
  '/',
  verifyAuthentication,
  upload.single('image'),
  gameController.store,
);

export default gameRoutes;
