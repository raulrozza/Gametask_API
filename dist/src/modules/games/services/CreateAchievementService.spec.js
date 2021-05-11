"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const uuid_1 = require("uuid");
const fakes_1 = require("../fakes");
const FakeAchievement_1 = __importDefault(require("../fakes/FakeAchievement"));
const FakeAchievementsRepository_1 = __importDefault(require("../repositories/fakes/FakeAchievementsRepository"));
const FakeTitlesRepository_1 = __importDefault(require("../repositories/fakes/FakeTitlesRepository"));
const CreateAchievementService_1 = __importDefault(require("./CreateAchievementService"));
describe('CreateAchievementService', () => {
    it('should create the achievement with title', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const titlesRepository = new FakeTitlesRepository_1.default();
        const createAchievement = new CreateAchievementService_1.default(achievementsRepository, titlesRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const fakeTitle = new fakes_1.FakeTitle(gameId);
        const title = await titlesRepository.create({
            name: fakeTitle.name,
            game: fakeTitle.game,
        });
        const payload = {
            gameId,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
            title: title.id,
        };
        const achievement = await createAchievement.execute(payload);
        expect(achievement).toHaveProperty('id');
        expect(achievement.name).toBe(fakeAchievement.name);
        expect(achievement.description).toBe(fakeAchievement.description);
        expect(achievement.title).toBe(title.id);
    });
    it('should create the achievement without a title', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const titlesRepository = new FakeTitlesRepository_1.default();
        const createAchievement = new CreateAchievementService_1.default(achievementsRepository, titlesRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const payload = {
            gameId,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
        };
        const achievement = await createAchievement.execute(payload);
        expect(achievement).toHaveProperty('id');
        expect(achievement.name).toBe(fakeAchievement.name);
        expect(achievement.description).toBe(fakeAchievement.description);
    });
    it('should throw when creating the achievement with an unexisting title', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const titlesRepository = new FakeTitlesRepository_1.default();
        const createAchievement = new CreateAchievementService_1.default(achievementsRepository, titlesRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const payload = {
            gameId,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
            title: 'fake title',
        };
        await expect(createAchievement.execute(payload)).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
