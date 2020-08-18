const express = require('express');
const multer = require('multer');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');
const uploadConfig = require('../config/upload');

const AchievementController = require('../controllers/AchievementController');

const achievementRoutes = express.Router();
const upload = multer(uploadConfig('achievement'));

achievementRoutes.delete(
  '/:id',
  verifyJwt,
  verifyGame,
  AchievementController.delete,
);
achievementRoutes.get('/', verifyJwt, verifyGame, AchievementController.index);
achievementRoutes.get(
  '/:id',
  verifyJwt,
  verifyGame,
  AchievementController.show,
);
achievementRoutes.post(
  '/',
  verifyJwt,
  verifyGame,
  upload.single('image'),
  AchievementController.store,
);
achievementRoutes.put(
  '/:id',
  verifyJwt,
  verifyGame,
  upload.single('image'),
  AchievementController.update,
);

module.exports = achievementRoutes;
