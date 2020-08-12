const express = require('express');
const multer = require('multer');
const verifyJwt = require('../middlewares/verifyJwt');
const uploadConfig = require('../config/upload');

const GameController = require('../controllers/GameController');

const gameRoutes = express.Router();
const upload = multer(uploadConfig('game'));

gameRoutes.get('/', verifyJwt, GameController.index);
gameRoutes.get('/:id', verifyJwt, GameController.show);
gameRoutes.put(
  '/:id',
  verifyJwt,
  upload.single('image'),
  GameController.update,
);
gameRoutes.post('/', verifyJwt, upload.single('image'), GameController.store);

module.exports = gameRoutes;
