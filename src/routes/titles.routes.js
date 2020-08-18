const express = require('express');
const verifyGame = require('../middlewares/verifyGame');
const verifyJwt = require('../middlewares/verifyJwt');

const TitleController = require('../controllers/TitleController');

const titleRoutes = express.Router();

titleRoutes.delete('/:id', verifyJwt, verifyGame, TitleController.delete);
titleRoutes.get('/', verifyJwt, verifyGame, TitleController.index);
titleRoutes.post('/', verifyJwt, verifyGame, TitleController.store);
titleRoutes.put('/:id', verifyJwt, verifyGame, TitleController.update);

module.exports = titleRoutes;
