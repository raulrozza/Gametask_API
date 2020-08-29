const express = require('express');
const verifyJwt = require('../middlewares/verifyJwt');

const InviteController = require('../controllers/InviteController');

const inviteRoutes = express.Router();

inviteRoutes.get('/:gameId/:inviter', verifyJwt, InviteController.show);

module.exports = inviteRoutes;
