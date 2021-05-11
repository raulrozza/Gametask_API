"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeAchievement_1 = __importDefault(require("../fakes/FakeAchievement"));
const FakeAchievementsRepository_1 = __importDefault(require("../repositories/fakes/FakeAchievementsRepository"));
const ListAchievementsService_1 = __importDefault(require("./ListAchievementsService"));
describe('ListAchievementsService', () => {
    it('should list only the achievements of the selected game', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const listAchievements = new ListAchievementsService_1.default(achievementsRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        await achievementsRepository.create({
            game: fakeAchievement.game,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
        });
        await achievementsRepository.create({
            game: fakeAchievement.game,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
        });
        await achievementsRepository.create({
            game: 'another_game_id',
            name: fakeAchievement.name,
            description: fakeAchievement.description,
        });
        const achievements = await listAchievements.execute(gameId);
        expect(achievements).toHaveLength(2);
    });
});
