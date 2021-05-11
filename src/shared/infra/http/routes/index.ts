import express from 'express';
import { resolve } from 'path';
import {
  internalErrorHandler,
  multerErrorHandler,
  notFoundErrorHandler,
  requestErrorHandler,
} from '@shared/infra/http/middlewares';

import { usersRoutes } from '@modules/users/infra/http/routes';
import {
  achievementRoutes,
  activityRoutes,
  gameRoutes,
  titleRoutes,
} from '@modules/games/infra/http/routes';
import {
  feedPostsRoutes,
  leaderboardsRouter,
  playerRoutes,
  requestsRoutes,
} from '@modules/players/infra/http/routes';

const appRoutes = express.Router();

// Static routes
appRoutes.use(
  '/files',
  express.static(resolve(__dirname, '..', '..', '..', '..', '..', 'uploads')),
);

// Routes
appRoutes.get('/', (_, response) => {
  return response.json({ message: 'Welcome to GameTask API' });
});
appRoutes.use('/achievements', achievementRoutes);
appRoutes.use('/activities', activityRoutes);
appRoutes.use('/feed', feedPostsRoutes);
appRoutes.use('/leaderboards', leaderboardsRouter);
appRoutes.use('/games', gameRoutes);
appRoutes.use('/players', playerRoutes);
appRoutes.use('/requests', requestsRoutes);
appRoutes.use('/titles', titleRoutes);
appRoutes.use('/users', usersRoutes);

// Handlers
appRoutes.use(notFoundErrorHandler);
appRoutes.use(requestErrorHandler);
appRoutes.use(multerErrorHandler);
appRoutes.use(internalErrorHandler);

export default appRoutes;
