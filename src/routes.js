const express = require('express');
const multer = require('multer');
const verify = require('./services/jwt/verify');
const uploadConfig = require('./config/upload');

// Controllers
const AchievementController = require('./controllers/AchievementController');
const ActivityController = require('./controllers/ActivityController');
const ActivityRegisterController = require('./controllers/ActivityRegisterController');
const AuthenticationController = require('./controllers/AuthenticationController');
const GameController = require('./controllers/GameController');
const LevelController = require('./controllers/LevelController');
const RankController = require('./controllers/RankController');
const UserController = require('./controllers/UserController');
const TitleController = require('./controllers/TitleController');

const routes = express.Router();
const upload = multer(uploadConfig);

// Achievements
routes.delete('/achievement/:id', verify, AchievementController.delete);
routes.get('/achievements', verify, AchievementController.index);
routes.get('/achievement/:id', verify, AchievementController.show);
routes.post(
  '/achievement',
  verify,
  upload.single('image'),
  AchievementController.store,
);
routes.put(
  '/achievement/:id',
  verify,
  upload.single('image'),
  AchievementController.update,
);

// Activity
routes.delete('/activity/:id', verify, ActivityController.delete);
routes.get('/activities', verify, ActivityController.index);
routes.get('/activity/:id', verify, ActivityController.show);
routes.post('/activity', verify, ActivityController.store);
routes.put('/activity/:id', verify, ActivityController.update);

// Activity Register
routes.get('/activityRegisters', verify, ActivityRegisterController.index);
routes.post('/activityRegister', verify, ActivityRegisterController.store);

// Auth
routes.post('/login', AuthenticationController.store);

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
routes.delete('/title/:id', verify, TitleController.delete);
routes.get('/titles', verify, TitleController.index);
routes.post('/title', verify, TitleController.store);
routes.put('/title/:id', verify, TitleController.update);

module.exports = routes;
