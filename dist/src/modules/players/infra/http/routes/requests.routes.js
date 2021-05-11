"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@modules/players/infra/http/controllers");
const verifyAuthentication_1 = __importDefault(require("@modules/users/infra/http/middlewares/verifyAuthentication"));
const verifyGameSelected_1 = __importDefault(require("@modules/games/infra/http/middlewares/verifyGameSelected"));
const requestsRoutes = express_1.Router();
const completeActivityRequestController = new controllers_1.CompleteActivityRequestController();
const playerActivitiesController = new controllers_1.PlayerActivitiesController();
const unlockAchievementRequestController = new controllers_1.UnlockAchievementRequestController();
requestsRoutes.get('/achievements', verifyAuthentication_1.default, verifyGameSelected_1.default, unlockAchievementRequestController.index);
requestsRoutes.get('/activities', verifyAuthentication_1.default, verifyGameSelected_1.default, completeActivityRequestController.index);
requestsRoutes.patch('/activities/:id/complete', verifyAuthentication_1.default, verifyGameSelected_1.default, playerActivitiesController.update);
requestsRoutes.delete('/achievements/:id', verifyAuthentication_1.default, verifyGameSelected_1.default, unlockAchievementRequestController.remove);
requestsRoutes.delete('/activities/:id', verifyAuthentication_1.default, verifyGameSelected_1.default, completeActivityRequestController.remove);
exports.default = requestsRoutes;
