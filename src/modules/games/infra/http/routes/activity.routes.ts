import { Router } from 'express';

import { ActivityController } from '@modules/games/infra/http/controllers';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

const activityRoutes = Router();
const activityController = new ActivityController();

activityRoutes.delete(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  activityController.remove,
);
activityRoutes.get(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  activityController.show,
);
activityRoutes.get(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  activityController.index,
);
activityRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  activityController.store,
);
activityRoutes.put(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  activityController.update,
);

export default activityRoutes;
