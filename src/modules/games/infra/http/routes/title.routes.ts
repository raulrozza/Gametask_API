import { Router } from 'express';
import { TitleController } from '@modules/games/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const titleRoutes = Router();
const titleController = new TitleController();

titleRoutes.delete(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  titleController.remove,
);
titleRoutes.get(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  titleController.index,
);
titleRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  titleController.store,
);
titleRoutes.put(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  titleController.update,
);

export default titleRoutes;
