import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';
import {
  AchievementAvatarController,
  AchievementController,
} from '@modules/games/infra/http/controllers';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';

const achievementRoutes = Router();
const upload = multer(uploadConfig.multerConfig);
const achievementController = new AchievementController();
const achievementAvatarController = new AchievementAvatarController();

achievementRoutes.delete(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  achievementController.remove,
);
achievementRoutes.get(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  achievementController.show,
);
achievementRoutes.get(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  achievementController.index,
);
achievementRoutes.patch(
  '/:id/avatar',
  verifyAuthentication,
  verifyGameSelected,
  upload.single('image'),
  achievementAvatarController.update,
);
achievementRoutes.put(
  '/:id',
  verifyAuthentication,
  verifyGameSelected,
  achievementController.update,
);
achievementRoutes.post(
  '/',
  verifyAuthentication,
  verifyGameSelected,
  achievementController.store,
);

export default achievementRoutes;
