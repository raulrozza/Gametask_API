import express from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import {
  AuthenticationController,
  UsersAvatarController,
  UsersController,
} from '@modules/users/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

const authenticationController = new AuthenticationController();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const usersRoutes = express.Router();
const upload = multer(uploadConfig.multerConfig);

usersRoutes.get('/:id', verifyAuthentication, usersController.show);
usersRoutes.patch(
  '/avatar',
  verifyAuthentication,
  upload.single('avatar'),
  usersAvatarController.update,
);
usersRoutes.post('/login', authenticationController.store);
usersRoutes.post('/signup', usersController.store);

export default usersRoutes;
