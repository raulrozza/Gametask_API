import { Router } from 'express';
import { TitleController } from '@modules/games/infra/http/controllers';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const titleRoutes = Router();
const titleController = new TitleController();

titleRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  titleController.store,
);

export default titleRoutes;
