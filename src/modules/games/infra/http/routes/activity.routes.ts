import { Router } from 'express';

import { ActivityController } from '@modules/games/infra/http/controllers';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

const activityRoutes = Router();
const activityController = new ActivityController();

activityRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  activityController.store,
);

export default activityRoutes;
