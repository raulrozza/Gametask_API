import { Router } from 'express';

import {
  CompleteActivityRequestController,
  PlayerAchievementsController,
  PlayersController,
  PlayerTitlesController,
  UnlockAchievementRequestController,
} from '@modules/players/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const playerRoutes = Router();
const completeActivityRequest = new CompleteActivityRequestController();
const playerAchievementsController = new PlayerAchievementsController();
const playersController = new PlayersController();
const playerTitlesController = new PlayerTitlesController();
const unlockAchievementRequestController = new UnlockAchievementRequestController();

playerRoutes.post(
  '/:id/achievements',
  verifyAuthentication,
  verifyGameSelected,
  unlockAchievementRequestController.store,
);
playerRoutes.patch(
  '/:id/achievements',
  verifyAuthentication,
  verifyGameSelected,
  playerAchievementsController.update,
);
playerRoutes.post(
  '/:id/activities',
  verifyAuthentication,
  verifyGameSelected,
  completeActivityRequest.store,
);

playerRoutes.get(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  playersController.show,
);
playerRoutes.get('/', verifyAuthentication, playersController.index);
playerRoutes.patch(
  '/:id/titles',
  verifyAuthentication,
  verifyGameSelected,
  playerTitlesController.update,
);
playerRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  playersController.store,
);

export default playerRoutes;
