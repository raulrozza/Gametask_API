import { Router } from 'express';

import FeedPostsController from '@modules/players/infra/http/controllers/FeedPostsController';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const feedPostsRoutes = Router();
const feedPostsController = new FeedPostsController();

feedPostsRoutes.get(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  feedPostsController.index,
);

export default feedPostsRoutes;
