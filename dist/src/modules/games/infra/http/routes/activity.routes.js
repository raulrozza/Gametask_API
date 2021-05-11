"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@modules/games/infra/http/controllers");
const verifyGameSelected_1 = __importDefault(require("@modules/games/infra/http/middlewares/verifyGameSelected"));
const verifyAuthentication_1 = __importDefault(require("@modules/users/infra/http/middlewares/verifyAuthentication"));
const activityRoutes = express_1.Router();
const activityController = new controllers_1.ActivityController();
activityRoutes.delete('/:id', verifyAuthentication_1.default, verifyGameSelected_1.default, activityController.remove);
activityRoutes.get('/:id', verifyAuthentication_1.default, verifyGameSelected_1.default, activityController.show);
activityRoutes.get('/', verifyAuthentication_1.default, verifyGameSelected_1.default, activityController.index);
activityRoutes.post('/', verifyAuthentication_1.default, verifyGameSelected_1.default, activityController.store);
activityRoutes.put('/:id', verifyAuthentication_1.default, verifyGameSelected_1.default, activityController.update);
exports.default = activityRoutes;
