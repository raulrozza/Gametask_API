const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const GameplayController = require('../controllers/GameplayController');

const gameplayRoutes = express.Router();

gameplayRoutes.get('/', verifyJwt, GameplayController.index);
gameplayRoutes.get('/:id', verifyJwt, verifyGame, GameplayController.show);

module.exports = gameplayRoutes;
