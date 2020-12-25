import express from 'express';
import verifyJwt from 'middlewares/verifyJwt';

import LevelController from 'controllers/LevelController';

const levelRoutes = express.Router();

levelRoutes.put('/:id', verifyJwt, LevelController.update);

export default levelRoutes;
