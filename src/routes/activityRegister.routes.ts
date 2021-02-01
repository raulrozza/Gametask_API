import express from 'express';
import verifyGame from '@middlewares/verifyGame';
import verifyJwt from '@middlewares/verifyJwt';

import ActivityRegisterController from '@controllers/ActivityRegisterController';

const activityRegisterRoutes = express.Router();

activityRegisterRoutes.get(
  '/',
  verifyJwt,
  verifyGame,
  ActivityRegisterController.index,
);
activityRegisterRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  ActivityRegisterController.store,
);
activityRegisterRoutes.delete(
  '/:id',
  verifyJwt,
  verifyGame,
  ActivityRegisterController.delete,
);

export default activityRegisterRoutes;
