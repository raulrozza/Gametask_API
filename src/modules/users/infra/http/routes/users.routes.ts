import express from 'express';
import multer from 'multer';
import verifyJwt from '@middlewares/verifyJwt';
import uploadConfig from '@config/upload';

import { UsersController } from '@modules/users/infra/http/controllers';

const usersController = new UsersController();

const usersRoutes = express.Router();
const upload = multer(uploadConfig('user'));

usersRoutes.get('/:id', verifyJwt, usersController.show);
usersRoutes.put(
  '/',
  verifyJwt,
  upload.single('avatar'),
  usersController.update,
);
usersRoutes.post('/signup', usersController.store);

export default usersRoutes;
