"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleRoutes = exports.gameRoutes = exports.activityRoutes = exports.achievementRoutes = void 0;
var achievement_routes_1 = require("./achievement.routes");
Object.defineProperty(exports, "achievementRoutes", { enumerable: true, get: function () { return __importDefault(achievement_routes_1).default; } });
var activity_routes_1 = require("./activity.routes");
Object.defineProperty(exports, "activityRoutes", { enumerable: true, get: function () { return __importDefault(activity_routes_1).default; } });
var game_routes_1 = require("./game.routes");
Object.defineProperty(exports, "gameRoutes", { enumerable: true, get: function () { return __importDefault(game_routes_1).default; } });
var title_routes_1 = require("./title.routes");
Object.defineProperty(exports, "titleRoutes", { enumerable: true, get: function () { return __importDefault(title_routes_1).default; } });
