const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const PlayerController = require('../controllers/PlayerController');

const playerRoutes = express.Router();

playerRoutes.get('/', verifyJwt, verifyGame, PlayerController.index);
playerRoutes.get('/:id', verifyJwt, verifyGame, PlayerController.show);
playerRoutes.post('/', verifyJwt, PlayerController.store);

module.exports = playerRoutes;
