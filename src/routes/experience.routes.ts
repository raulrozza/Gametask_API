import express from 'express';
import verifyGame from 'middlewares/verifyGame';
import verifyJwt from 'middlewares/verifyJwt';

import ExperienceController from 'controllers/ExperienceController';

const experienceRoutes = express.Router();

experienceRoutes.post('/', verifyJwt, verifyGame, ExperienceController.store);

export default experienceRoutes;
