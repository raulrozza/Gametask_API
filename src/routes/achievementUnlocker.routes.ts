import express from 'express';
import verifyGame from '@middlewares/verifyGame';
import verifyJwt from '@middlewares/verifyJwt';

import AchievementUnlockerController from '@controllers/AchievementUnlockerController';

const achievementUnlockerRoutes = express.Router();

achievementUnlockerRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  AchievementUnlockerController.store,
);

export default achievementUnlockerRoutes;
