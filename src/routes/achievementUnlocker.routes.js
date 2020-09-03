const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const AchievementUnlockerController = require('../controllers/AchievementUnlockerController');

const achievementUnlockerRoutes = express.Router();

achievementUnlockerRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  AchievementUnlockerController.store,
);

module.exports = achievementUnlockerRoutes;
