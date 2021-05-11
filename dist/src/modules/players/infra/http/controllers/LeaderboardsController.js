"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/players/services");
class LeaderboardsService {
    constructor() {
        this.show = async (request, response) => {
            const gameId = request.game;
            const showCurrentLeaderboard = tsyringe_1.container.resolve(services_1.ShowCurrentLeaderboardService);
            const leaderboard = await showCurrentLeaderboard.execute(gameId);
            return response.json(leaderboard);
        };
    }
}
exports.default = LeaderboardsService;
