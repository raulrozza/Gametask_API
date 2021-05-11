"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@modules/players/infra/http/controllers");
const verifyAuthentication_1 = __importDefault(require("@modules/users/infra/http/middlewares/verifyAuthentication"));
const verifyGameSelected_1 = __importDefault(require("@modules/games/infra/http/middlewares/verifyGameSelected"));
const leaderboardsRouter = express_1.Router();
const leaderboardsController = new controllers_1.LeaderboardsController();
leaderboardsRouter.get('/', verifyAuthentication_1.default, verifyGameSelected_1.default, leaderboardsController.show);
exports.default = leaderboardsRouter;
