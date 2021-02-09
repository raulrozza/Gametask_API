import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import { Router } from 'express';
import AchievementController from '../controllers/AchievementController';
import verifyGameSelected from '../middlewares/verifyGameSelected';

const achievementRoutes = Router();
const achievementController = new AchievementController();

achievementRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  achievementController.store,
);

export default achievementRoutes;
