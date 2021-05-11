"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestsRoutes = exports.playerRoutes = exports.leaderboardsRouter = exports.feedPostsRoutes = void 0;
var feedPosts_routes_1 = require("./feedPosts.routes");
Object.defineProperty(exports, "feedPostsRoutes", { enumerable: true, get: function () { return __importDefault(feedPosts_routes_1).default; } });
var leaderboards_routes_1 = require("./leaderboards.routes");
Object.defineProperty(exports, "leaderboardsRouter", { enumerable: true, get: function () { return __importDefault(leaderboards_routes_1).default; } });
var players_routes_1 = require("./players.routes");
Object.defineProperty(exports, "playerRoutes", { enumerable: true, get: function () { return __importDefault(players_routes_1).default; } });
var requests_routes_1 = require("./requests.routes");
Object.defineProperty(exports, "requestsRoutes", { enumerable: true, get: function () { return __importDefault(requests_routes_1).default; } });
