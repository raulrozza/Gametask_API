const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const ActivityRegisterController = require('../controllers/ActivityRegisterController');

const activityRegisterRoutes = express.Router();

activityRegisterRoutes.get(
  '/',
  verifyJwt,
  verifyGame,
  ActivityRegisterController.index,
);
activityRegisterRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  ActivityRegisterController.store,
);
activityRegisterRoutes.delete(
  '/:id',
  verifyJwt,
  verifyGame,
  ActivityRegisterController.delete,
);

module.exports = activityRegisterRoutes;
