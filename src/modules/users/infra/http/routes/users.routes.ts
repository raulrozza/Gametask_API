import express from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import { UsersController } from '@modules/users/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

const usersController = new UsersController();

const usersRoutes = express.Router();
const upload = multer(uploadConfig.multerConfig);

usersRoutes.get('/:id', verifyAuthentication, usersController.show);
usersRoutes.put(
  '/',
  verifyAuthentication,
  upload.single('avatar'),
  usersController.update,
);
usersRoutes.post('/signup', usersController.store);

export default usersRoutes;
