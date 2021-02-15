import { Router } from 'express';
import {
  CompleteActivityRequestController,
  UnlockAchievementRequestController,
} from '@modules/players/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const requestsRoutes = Router();
const completeActivityRequestController = new CompleteActivityRequestController();
const unlockAchievementRequestController = new UnlockAchievementRequestController();

requestsRoutes.get(
  '/achievements',
  verifyAuthentication,
  verifyGameSelected,
  unlockAchievementRequestController.index,
);
requestsRoutes.get(
  '/activities',
  verifyAuthentication,
  verifyGameSelected,
  completeActivityRequestController.index,
);
requestsRoutes.delete(
  '/achievements/:id',
  verifyAuthentication,
  verifyGameSelected,
  unlockAchievementRequestController.remove,
);
requestsRoutes.delete(
  '/activities/:id',
  verifyAuthentication,
  verifyGameSelected,
  completeActivityRequestController.remove,
);

export default requestsRoutes;
