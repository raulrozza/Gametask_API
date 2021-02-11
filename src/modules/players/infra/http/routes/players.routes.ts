import { Router } from 'express';

import PlayersController from '@modules/players/infra/http/controllers/PlayersController';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const playerRoutes = Router();
const playersController = new PlayersController();

playerRoutes.get('/', verifyAuthentication, playersController.index);
playerRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  playersController.store,
);

export default playerRoutes;
