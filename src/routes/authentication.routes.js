const express = require('express');

const AuthenticationController = require('../controllers/AuthenticationController');

const authenticationRoutes = express.Router();

authenticationRoutes.post('/', AuthenticationController.store);

module.exports = authenticationRoutes;
