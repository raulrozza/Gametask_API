import express from 'express';
import verifyJwt from '@middlewares/verifyJwt';

import InviteController from '@controllers/InviteController';

const inviteRoutes = express.Router();

inviteRoutes.get('/:gameId/:inviter', verifyJwt, InviteController.show);

export default inviteRoutes;
