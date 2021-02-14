import { Router } from 'express';
import { UnlockAchievementRequestController } from '@modules/players/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const requestsRoutes = Router();
const unlockAchievementRequestController = new UnlockAchievementRequestController();

requestsRoutes.get(
  '/achievements',
  verifyAuthentication,
  verifyGameSelected,
  unlockAchievementRequestController.index,
);
requestsRoutes.delete(
  '/achievements/:id',
  verifyAuthentication,
  verifyGameSelected,
  unlockAchievementRequestController.remove,
);

export default requestsRoutes;
