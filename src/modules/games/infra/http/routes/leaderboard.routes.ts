import express from 'express';

import { LeaderboardsController } from '@modules/games/infra/http/controllers';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

const leaderboardsController = new LeaderboardsController();

const leaderboardsRoutes = express.Router();

leaderboardsRoutes.post(
  '/reset',
  verifyAuthentication,
  verifyGameSelected,
  leaderboardsController.store,
);

export default leaderboardsRoutes;
