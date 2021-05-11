"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeUnlockAchievementRequest_1 = __importDefault(require("../fakes/FakeUnlockAchievementRequest"));
const FakeUnlockAchievementRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeUnlockAchievementRequestRepository"));
const ListUnlockAchievementRequestsService_1 = __importDefault(require("./ListUnlockAchievementRequestsService"));
describe('ListUnlockAchievementRequestsService', () => {
    it('should list both the achievement requests from the game', async () => {
        const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository_1.default();
        const listUnlockAchievementRequestsService = new ListUnlockAchievementRequestsService_1.default(unlockAchievementRequestRepository);
        const playerId = uuid_1.v4();
        const gameId = uuid_1.v4();
        const achievementId = uuid_1.v4();
        const fakeRequest = new FakeUnlockAchievementRequest_1.default(gameId, playerId, achievementId);
        await unlockAchievementRequestRepository.create(Object.assign({}, fakeRequest));
        await unlockAchievementRequestRepository.create(Object.assign(Object.assign({}, fakeRequest), { game: 'another-game' }));
        await unlockAchievementRequestRepository.create(Object.assign(Object.assign({}, fakeRequest), { achievement: 'another-achievement' }));
        const requests = await listUnlockAchievementRequestsService.execute(gameId);
        expect(requests).toHaveLength(2);
    });
});
