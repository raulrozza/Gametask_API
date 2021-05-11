"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeAchievement_1 = __importDefault(require("../fakes/FakeAchievement"));
const FakeAchievementsRepository_1 = __importDefault(require("../repositories/fakes/FakeAchievementsRepository"));
const ShowAchievementService_1 = __importDefault(require("./ShowAchievementService"));
describe('ShowAchievementService', () => {
    it('should return the correct achievement', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const showAchievement = new ShowAchievementService_1.default(achievementsRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const achievement = await achievementsRepository.create({
            name: fakeAchievement.name,
            description: fakeAchievement.description,
            game: fakeAchievement.game,
        });
        const fetchedAchievement = await showAchievement.execute({
            achievementId: achievement.id,
            gameId,
        });
        expect(fetchedAchievement).toEqual(achievement);
    });
    it('should return undefined when trying to fetch an achievement while providing a wrong id', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const showAchievement = new ShowAchievementService_1.default(achievementsRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const achievement = await achievementsRepository.create({
            name: fakeAchievement.name,
            description: fakeAchievement.description,
            game: 'random-game-id',
        });
        const fetchedAchievement = await showAchievement.execute({
            achievementId: achievement.id,
            gameId,
        });
        expect(fetchedAchievement).toBeUndefined();
    });
});
