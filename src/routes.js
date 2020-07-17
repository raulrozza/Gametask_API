const express = require('express');
const multer = require('multer');
const checkGame = require('./services/game');
const verify = require('./services/jwt/verify');
const uploadConfig = require('./config/upload');

// Controllers
const AchievementController = require('./controllers/AchievementController');
const ActivityController = require('./controllers/ActivityController');
const ActivityRegisterController = require('./controllers/ActivityRegisterController');
const AuthenticationController = require('./controllers/AuthenticationController');
const ExperienceController = require('./controllers/ExperienceController');
const GameController = require('./controllers/GameController');
const LevelController = require('./controllers/LevelController');
const RankController = require('./controllers/RankController');
const UserController = require('./controllers/UserController');
const TitleController = require('./controllers/TitleController');

const routes = express.Router();
const upload = multer(uploadConfig);

// Achievements
routes.delete(
  '/achievement/:id',
  verify,
  checkGame,
  AchievementController.delete,
);
routes.get('/achievements', verify, checkGame, AchievementController.index);
routes.get('/achievement/:id', verify, checkGame, AchievementController.show);
routes.post(
  '/achievement',
  verify,
  checkGame,
  upload.single('image'),
  AchievementController.store,
);
routes.put(
  '/achievement/:id',
  verify,
  checkGame,
  upload.single('image'),
  AchievementController.update,
);

// Activity
routes.delete('/activity/:id', verify, checkGame, ActivityController.delete);
routes.get('/activities', verify, checkGame, ActivityController.index);
routes.get('/activity/:id', verify, checkGame, ActivityController.show);
routes.post('/activity', verify, checkGame, ActivityController.store);
routes.put('/activity/:id', verify, checkGame, ActivityController.update);

// Activity Register
routes.get(
  '/activityRegisters',
  verify,
  checkGame,
  ActivityRegisterController.index,
);
routes.post(
  '/activityRegister',
  verify,
  checkGame,
  ActivityRegisterController.store,
);
routes.delete(
  '/activityRegister/:id',
  verify,
  checkGame,
  ActivityRegisterController.delete,
);

// Auth
routes.post('/login', AuthenticationController.store);

// Experience
routes.post('/experience', verify, checkGame, ExperienceController.store);

// Game Routes
routes.get('/game/:id', verify, GameController.show);
routes.put('/game/:id', verify, upload.single('image'), GameController.update);
routes.post('/game', verify, upload.single('image'), GameController.store);
routes.put('/level/:id', verify, LevelController.update);
routes.put('/rank/:id', verify, RankController.update);

// User options
routes.get('/users', verify, UserController.index);
routes.get('/user/:id', verify, UserController.show);
routes.post('/signup', UserController.store);

// Title
routes.delete('/title/:id', verify, checkGame, TitleController.delete);
routes.get('/titles', verify, checkGame, TitleController.index);
routes.post('/title', verify, checkGame, TitleController.store);
routes.put('/title/:id', verify, checkGame, TitleController.update);

module.exports = routes;
