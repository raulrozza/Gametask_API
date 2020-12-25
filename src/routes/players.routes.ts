import express from 'express';
import verifyGame from 'middlewares/verifyGame';
import verifyJwt from 'middlewares/verifyJwt';

import PlayerController from 'controllers/PlayerController';

const playerRoutes = express.Router();

playerRoutes.get('/', verifyJwt, verifyGame, PlayerController.index);
playerRoutes.get('/:id', verifyJwt, verifyGame, PlayerController.show);
playerRoutes.put('/:id', verifyJwt, verifyGame, PlayerController.update);
playerRoutes.post('/', verifyJwt, PlayerController.store);

export default playerRoutes;
