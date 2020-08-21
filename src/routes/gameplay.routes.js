const express = require('express');
const verifyJwt = require('../middlewares/verifyJwt');

const GameplayController = require('../controllers/GameplayController');

const gameplayRoutes = express.Router();

gameplayRoutes.get('/', verifyJwt, GameplayController.index);

module.exports = gameplayRoutes;
