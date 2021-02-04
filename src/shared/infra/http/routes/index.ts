import express from 'express';
import { resolve } from 'path';
import {
  internalErrorHandler,
  notFoundErrorHandler,
  requestErrorHandler,
} from '@shared/infra/http/middlewares';

// Routes

const appRoutes = express.Router();

// Static routes
appRoutes.use('/files', express.static(resolve(__dirname, '..', 'uploads')));

// Routes

// Handlers
appRoutes.use(notFoundErrorHandler);
appRoutes.use(requestErrorHandler);
appRoutes.use(internalErrorHandler);

export default appRoutes;
