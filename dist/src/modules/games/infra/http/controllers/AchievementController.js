"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/games/services");
class AchievementController {
    constructor() {
        this.index = async (request, response) => {
            const gameId = request.game;
            const listAchievements = tsyringe_1.container.resolve(services_1.ListAchievementsService);
            const achievements = await listAchievements.execute(gameId);
            return response.json(achievements);
        };
        this.remove = async (request, response) => {
            const gameId = request.game;
            const { id } = request.params;
            const deleteAchievement = tsyringe_1.container.resolve(services_1.DeleteAchievementService);
            await deleteAchievement.execute({ id, gameId });
            return response.status(201).end();
        };
        this.show = async (request, response) => {
            const gameId = request.game;
            const { id } = request.params;
            const showAchievement = tsyringe_1.container.resolve(services_1.ShowAchievementService);
            const achievement = await showAchievement.execute({
                gameId,
                achievementId: id,
            });
            return response.json(achievement);
        };
        this.store = async (request, response) => {
            const { name, description, title } = request.body;
            const gameId = request.game;
            const createAchievement = tsyringe_1.container.resolve(services_1.CreateAchievementService);
            const achievement = await createAchievement.execute({
                gameId,
                name,
                description,
                title,
            });
            return response.status(201).json(achievement);
        };
        this.update = async (request, response) => {
            const { name, description, title } = request.body;
            const { id } = request.params;
            const gameId = request.game;
            const updateAchievement = tsyringe_1.container.resolve(services_1.UpdateAchievementService);
            const achievement = await updateAchievement.execute({
                gameId,
                id,
                name,
                title,
                description,
            });
            return response.status(201).json(achievement);
        };
    }
}
exports.default = AchievementController;
