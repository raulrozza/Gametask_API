import express from 'express';
import multer from 'multer';
import verifyGame from '@middlewares/verifyGame';
import verifyJwt from '@middlewares/verifyJwt';
import uploadConfig from '@config/upload';

import AchievementController from '@controllers/AchievementController';

const achievementRoutes = express.Router();
const upload = multer(uploadConfig('achievement'));

achievementRoutes.delete(
  '/:id',
  verifyJwt,
  verifyGame,
  AchievementController.delete,
);
achievementRoutes.get('/', verifyJwt, verifyGame, AchievementController.index);
achievementRoutes.get(
  '/:id',
  verifyJwt,
  verifyGame,
  AchievementController.show,
);
achievementRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  upload.single('image'),
  AchievementController.store,
);
achievementRoutes.put(
  '/:id',
  verifyJwt,
  verifyGame,
  upload.single('image'),
  AchievementController.update,
);

export default achievementRoutes;
