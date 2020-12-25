import express from 'express';
import verifyGame from 'middlewares/verifyGame';
import verifyJwt from 'middlewares/verifyJwt';

import FeedController from 'controllers/FeedController';

const feedRoutes = express.Router();

feedRoutes.get('/', verifyJwt, verifyGame, FeedController.index);

export default feedRoutes;
