import express from 'express';
import verifyGame from '@middlewares/verifyGame';
import verifyJwt from '@middlewares/verifyJwt';

import AchievementRegisterController from '@controllers/AchievementRegisterController';

const achievementRegisterRoutes = express.Router();

achievementRegisterRoutes.get(
  '/',
  verifyJwt,
  verifyGame,
  AchievementRegisterController.index,
);
achievementRegisterRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  AchievementRegisterController.store,
);
achievementRegisterRoutes.delete(
  '/:id',
  verifyJwt,
  verifyGame,
  AchievementRegisterController.delete,
);

export default achievementRegisterRoutes;
