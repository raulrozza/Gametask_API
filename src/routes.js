const express = require('express');
const verify = require('./services/jwt/verify');

// Controllers
const AuthenticationController = require('./controllers/AuthenticationController');
const UserController = require('./controllers/UserController');

const routes = express.Router();

// Auth
routes.post('/login', AuthenticationController.store);

// User options
routes.get('/users', verify, UserController.index);
routes.get('/user/:id', verify, UserController.show);
routes.post('/signup', UserController.store);

module.exports = routes;