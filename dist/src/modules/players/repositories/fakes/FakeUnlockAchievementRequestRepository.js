"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class FakeUnlockAchievementRequestRepository {
    constructor() {
        this.unlockAchievementRequests = [];
    }
    async checkIfRequested(requester, gameId, achievementId) {
        const request = this.unlockAchievementRequests.find(request => request.requester === requester &&
            request.game === gameId &&
            request.achievement === achievementId);
        return Boolean(request);
    }
    async findAllFromGame(gameId) {
        return this.unlockAchievementRequests.filter(request => request.game === gameId);
    }
    async findOne(id) {
        return this.unlockAchievementRequests.find(request => request.id === id);
    }
    async create(request) {
        const newRequest = Object.assign({ id: uuid_1.v4() }, request);
        this.unlockAchievementRequests.push(newRequest);
        return Promise.resolve(newRequest);
    }
    async delete(id, gameId) {
        const foundIndex = this.unlockAchievementRequests.findIndex(request => request.id === id && request.game === gameId);
        if (foundIndex < 0)
            throw new Error('Request not found');
        this.unlockAchievementRequests.splice(foundIndex, 1);
    }
}
exports.default = FakeUnlockAchievementRequestRepository;
