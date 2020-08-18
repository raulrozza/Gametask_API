const express = require('express');
const verifyJwt = require('../middlewares/verifyJwt');

const LevelController = require('../controllers/LevelController');

const levelRoutes = express.Router();

levelRoutes.put('/:id', verifyJwt, LevelController.update);

module.exports = levelRoutes;
