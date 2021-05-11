"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/games/services");
class AchievementAvatarController {
    constructor() {
        this.update = async (request, response) => {
            const file = request.file;
            const gameId = request.game;
            const { id } = request.params;
            const updateAchievementAvatar = tsyringe_1.container.resolve(services_1.UpdateAchievementAvatarService);
            const updatedAchievement = await updateAchievementAvatar.execute({
                filename: file.filename,
                id,
                gameId,
            });
            return response.status(201).json(updatedAchievement);
        };
    }
}
exports.default = AchievementAvatarController;
