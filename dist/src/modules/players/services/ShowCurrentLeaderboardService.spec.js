"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeLeaderboard_1 = __importDefault(require("../fakes/FakeLeaderboard"));
const FakeLeaderboardsRepository_1 = __importDefault(require("../repositories/fakes/FakeLeaderboardsRepository"));
const ShowCurrentLeaderboardService_1 = __importDefault(require("./ShowCurrentLeaderboardService"));
describe('ShowCurrentLeaderboardService', () => {
    it('should return the current leaderboard', async () => {
        const leaderboardsRepository = new FakeLeaderboardsRepository_1.default();
        const showCurrentLeaderboardService = new ShowCurrentLeaderboardService_1.default(leaderboardsRepository);
        const gameId = uuid_1.v4();
        const fakeLeaderboard = new FakeLeaderboard_1.default(gameId);
        await leaderboardsRepository.create(fakeLeaderboard);
        const leaderboard = await showCurrentLeaderboardService.execute(gameId);
        expect(leaderboard).toHaveProperty('createdAt');
    });
});
