import express from 'express';
import multer from 'multer';
import verifyJwt from '@middlewares/verifyJwt';
import uploadConfig from '@config/upload';

import GameController from '@controllers/GameController';

const gameRoutes = express.Router();
const upload = multer(uploadConfig('game'));

gameRoutes.get('/', verifyJwt, GameController.index);
gameRoutes.get('/:id', verifyJwt, GameController.show);
gameRoutes.put(
  '/:id',
  verifyJwt,
  upload.single('image'),
  GameController.update,
);
gameRoutes.post('/', verifyJwt, upload.single('image'), GameController.store);

export default gameRoutes;
