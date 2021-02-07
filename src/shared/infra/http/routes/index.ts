import express from 'express';
import { resolve } from 'path';
import {
  internalErrorHandler,
  notFoundErrorHandler,
  requestErrorHandler,
} from '@shared/infra/http/middlewares';

import { usersRoutes } from '@modules/users/infra/http/routes';
import { gameRoutes } from '@modules/games/infra/http/routes';

const appRoutes = express.Router();

// Static routes
appRoutes.use('/files', express.static(resolve(__dirname, '..', 'uploads')));

// Routes
appRoutes.get('/', (_, response) => {
  return response.json({ message: 'Welcome to GameTask API' });
});
appRoutes.use('/users', usersRoutes);
appRoutes.use('/games', gameRoutes);

// Handlers
appRoutes.use(notFoundErrorHandler);
appRoutes.use(requestErrorHandler);
appRoutes.use(internalErrorHandler);

export default appRoutes;
