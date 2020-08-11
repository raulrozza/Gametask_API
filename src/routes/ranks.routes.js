const express = require('express');
const verifyJwt = require('../middlewares/verifyJwt');

const RankController = require('../controllers/RankController');

const rankRoutes = express.Router();

rankRoutes.put('/:id', verifyJwt, RankController.update);

module.exports = rankRoutes;
