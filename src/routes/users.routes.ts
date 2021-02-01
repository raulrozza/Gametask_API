import express from 'express';
import multer from 'multer';
import verifyJwt from '@middlewares/verifyJwt';
import uploadConfig from '@config/upload';

import UserController from '@controllers/UserController';

const userRoutes = express.Router();
const upload = multer(uploadConfig('user'));

userRoutes.get('/:id', verifyJwt, UserController.show);
userRoutes.put('/', verifyJwt, upload.single('avatar'), UserController.update);
userRoutes.post('/signup', UserController.store);

export default userRoutes;
