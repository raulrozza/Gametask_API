import express from 'express';
import verifyGame from 'middlewares/verifyGame';
import verifyJwt from 'middlewares/verifyJwt';

import TitleController from 'controllers/TitleController';

const titleRoutes = express.Router();

titleRoutes.delete('/:id', verifyJwt, verifyGame, TitleController.delete);
titleRoutes.get('/', verifyJwt, verifyGame, TitleController.index);
titleRoutes.post('/', verifyJwt, verifyGame, TitleController.store);
titleRoutes.put('/:id', verifyJwt, verifyGame, TitleController.update);

export default titleRoutes;
