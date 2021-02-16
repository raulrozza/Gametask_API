import { Router } from 'express';
import { LeaderboardsController } from '@modules/players/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const leaderboardsRouter = Router();
const leaderboardsController = new LeaderboardsController();

leaderboardsRouter.get(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  leaderboardsController.show,
);

export default leaderboardsRouter;
