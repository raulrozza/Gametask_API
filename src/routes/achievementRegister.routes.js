const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const AchievementRegisterController = require('../controllers/AchievementRegisterController');

const achievementRegisterRoutes = express.Router();

achievementRegisterRoutes.get(
  '/',
  verifyJwt,
  verifyGame,
  AchievementRegisterController.index,
);
achievementRegisterRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  AchievementRegisterController.store,
);
achievementRegisterRoutes.delete(
  '/:id',
  verifyJwt,
  verifyGame,
  AchievementRegisterController.delete,
);

module.exports = achievementRegisterRoutes;
