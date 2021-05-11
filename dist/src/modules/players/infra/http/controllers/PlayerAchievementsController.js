"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/players/services");
class PlayerAchievementsController {
    constructor() {
        this.update = async (request, response) => {
            const { userId, achievementId, requestId } = request.body;
            const gameId = request.game;
            const { id: playerId } = request.params;
            const unlockAchievement = tsyringe_1.container.resolve(services_1.UnlockAchievementService);
            await unlockAchievement.execute({
                userId,
                playerId,
                gameId,
                achievementId,
                requestId,
            });
            return response.status(201).end();
        };
    }
}
exports.default = PlayerAchievementsController;
