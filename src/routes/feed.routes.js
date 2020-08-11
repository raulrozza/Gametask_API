const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const FeedController = require('../controllers/FeedController');

const feedRoutes = express.Router();

feedRoutes.get('/', verifyJwt, verifyGame, FeedController.index);

module.exports = feedRoutes;
