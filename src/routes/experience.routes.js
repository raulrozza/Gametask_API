const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const ExperienceController = require('../controllers/ExperienceController');

const experienceRoutes = express.Router();

experienceRoutes.post('/', verifyJwt, verifyGame, ExperienceController.store);

module.exports = experienceRoutes;
