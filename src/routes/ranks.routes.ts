import express from 'express';
import verifyJwt from '@middlewares/verifyJwt';

import RankController from '@controllers/RankController';

const rankRoutes = express.Router();

rankRoutes.put('/:id', verifyJwt, RankController.update);

export default rankRoutes;
