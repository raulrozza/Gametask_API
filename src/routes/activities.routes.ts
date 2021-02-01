import express from 'express';
import verifyGame from '@middlewares/verifyGame';
import verifyJwt from '@middlewares/verifyJwt';

import ActivityController from '@controllers/ActivityController';

const activityRoutes = express.Router();

activityRoutes.delete('/:id', verifyJwt, verifyGame, ActivityController.delete);
activityRoutes.get('/', verifyJwt, verifyGame, ActivityController.index);
activityRoutes.get('/:id', verifyJwt, verifyGame, ActivityController.show);
activityRoutes.post('/', verifyJwt, verifyGame, ActivityController.store);
activityRoutes.put('/:id', verifyJwt, verifyGame, ActivityController.update);

export default activityRoutes;
