"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@modules/players/services");
const tsyringe_1 = require("tsyringe");
class UnlockAchievementRequestController {
    constructor() {
        this.index = async (request, response) => {
            const gameId = request.game;
            const listUnlockAchievementRequest = tsyringe_1.container.resolve(services_1.ListUnlockAchievementRequestsService);
            const requests = await listUnlockAchievementRequest.execute(gameId);
            return response.json(requests);
        };
        this.remove = async (request, response) => {
            const gameId = request.game;
            const { id } = request.params;
            const deleteUnlockAchievementRequest = tsyringe_1.container.resolve(services_1.DeleteUnlockAchievementRequestService);
            await deleteUnlockAchievementRequest.execute({ requestId: id, gameId });
            return response.status(201).end();
        };
        this.store = async (request, response) => {
            const { achievement, requestDate, information } = request.body;
            const gameId = request.game;
            const { id } = request.auth;
            const { id: requester } = request.params;
            const createUnlockAchievementRequest = tsyringe_1.container.resolve(services_1.CreateUnlockAchievementRequestService);
            const achievementRequest = await createUnlockAchievementRequest.execute({
                gameId,
                requester,
                achievement,
                requestDate,
                information,
                userId: id,
            });
            return response.status(201).json(achievementRequest);
        };
    }
}
exports.default = UnlockAchievementRequestController;
