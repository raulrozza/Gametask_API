"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const middlewares_1 = require("@shared/infra/http/middlewares");
const routes_1 = require("@modules/users/infra/http/routes");
const routes_2 = require("@modules/games/infra/http/routes");
const routes_3 = require("@modules/players/infra/http/routes");
const appRoutes = express_1.default.Router();
// Static routes
appRoutes.use('/files', express_1.default.static(path_1.resolve(__dirname, '..', '..', '..', '..', '..', 'uploads')));
// Routes
appRoutes.get('/', (_, response) => {
    return response.json({ message: 'Welcome to GameTask API' });
});
appRoutes.use('/achievements', routes_2.achievementRoutes);
appRoutes.use('/activities', routes_2.activityRoutes);
appRoutes.use('/feed', routes_3.feedPostsRoutes);
appRoutes.use('/leaderboards', routes_3.leaderboardsRouter);
appRoutes.use('/games', routes_2.gameRoutes);
appRoutes.use('/players', routes_3.playerRoutes);
appRoutes.use('/requests', routes_3.requestsRoutes);
appRoutes.use('/titles', routes_2.titleRoutes);
appRoutes.use('/users', routes_1.usersRoutes);
// Handlers
appRoutes.use(middlewares_1.notFoundErrorHandler);
appRoutes.use(middlewares_1.requestErrorHandler);
appRoutes.use(middlewares_1.multerErrorHandler);
appRoutes.use(middlewares_1.internalErrorHandler);
exports.default = appRoutes;
