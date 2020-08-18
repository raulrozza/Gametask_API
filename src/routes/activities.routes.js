const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const ActivityController = require('../controllers/ActivityController');

const activityRoutes = express.Router();

activityRoutes.delete('/:id', verifyJwt, verifyGame, ActivityController.delete);
activityRoutes.get('/', verifyJwt, verifyGame, ActivityController.index);
activityRoutes.get('/:id', verifyJwt, verifyGame, ActivityController.show);
activityRoutes.post('/', verifyJwt, verifyGame, ActivityController.store);
activityRoutes.put('/:id', verifyJwt, verifyGame, ActivityController.update);

module.exports = activityRoutes;
