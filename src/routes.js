const express = require('express');
const multer = require('multer');
const verify = require('./services/jwt/verify');
const uploadConfig = require('./config/upload');

// Controllers
const AuthenticationController = require('./controllers/AuthenticationController');
const GameController = require('./controllers/GameController');
const UserController = require('./controllers/UserController');

const routes = express.Router();
const upload = multer(uploadConfig);

// Auth
routes.post('/login', AuthenticationController.store);

// Game
routes.get('/game/:id', verify, GameController.index);
routes.post('/game', verify, upload.single('image'), GameController.store);

// User options
routes.get('/users', verify, UserController.index);
routes.get('/user/:id', verify, UserController.show);
routes.post('/signup', UserController.store);

module.exports = routes;