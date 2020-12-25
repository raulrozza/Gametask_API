import express from 'express';

import AuthenticationController from 'controllers/AuthenticationController';

const authenticationRoutes = express.Router();

authenticationRoutes.post('/', AuthenticationController.store);

export default authenticationRoutes;
