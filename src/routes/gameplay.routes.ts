import express from 'express';
import verifyGame from '@middlewares/verifyGame';
import verifyJwt from '@middlewares/verifyJwt';

import GameplayController from '@controllers/GameplayController';

const gameplayRoutes = express.Router();

gameplayRoutes.get('/', verifyJwt, GameplayController.index);
gameplayRoutes.get('/:id', verifyJwt, verifyGame, GameplayController.show);

export default gameplayRoutes;
