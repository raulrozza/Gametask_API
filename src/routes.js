const express = require('express');
const multer = require('multer');
const verify = require('./services/jwt/verify');
const uploadConfig = require('./config/upload');

// Controllers
const ActivityController = require('./controllers/ActivityController');
const AuthenticationController = require('./controllers/AuthenticationController');
const GameController = require('./controllers/GameController');
const RankController = require('./controllers/RankController');
const UserController = require('./controllers/UserController');
const TitleController = require('./controllers/TitleController');

const routes = express.Router();
const upload = multer(uploadConfig);

// Activity
routes.get('/activities', verify, ActivityController.index);
routes.post('/activity', verify, ActivityController.store);
routes.put('/activity/:id', verify, ActivityController.update);

// Auth
routes.post('/login', AuthenticationController.store);

// Game
routes.get('/game/:id', verify, GameController.show);
routes.post('/game', verify, upload.single('image'), GameController.store);

// Rank
routes.delete('/rank/:id', verify, RankController.delete);
routes.get('/ranks', verify, RankController.index);
routes.post('/rank', verify, RankController.store);
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