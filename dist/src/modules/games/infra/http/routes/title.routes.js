"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@modules/games/infra/http/controllers");
const verifyAuthentication_1 = __importDefault(require("@modules/users/infra/http/middlewares/verifyAuthentication"));
const verifyGameSelected_1 = __importDefault(require("@modules/games/infra/http/middlewares/verifyGameSelected"));
const titleRoutes = express_1.Router();
const titleController = new controllers_1.TitleController();
titleRoutes.delete('/:id', verifyAuthentication_1.default, verifyGameSelected_1.default, titleController.remove);
titleRoutes.get('/', verifyAuthentication_1.default, verifyGameSelected_1.default, titleController.index);
titleRoutes.post('/', verifyAuthentication_1.default, verifyGameSelected_1.default, titleController.store);
titleRoutes.put('/:id', verifyAuthentication_1.default, verifyGameSelected_1.default, titleController.update);
exports.default = titleRoutes;
