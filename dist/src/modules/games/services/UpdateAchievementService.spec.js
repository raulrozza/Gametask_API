"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const uuid_1 = require("uuid");
const FakeAchievement_1 = __importDefault(require("../fakes/FakeAchievement"));
const FakeAchievementsRepository_1 = __importDefault(require("../repositories/fakes/FakeAchievementsRepository"));
const UpdateAchievementService_1 = __importDefault(require("./UpdateAchievementService"));
describe('UpdateAchievementService', () => {
    it('should update the achievement correctly', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const updateAchievement = new UpdateAchievementService_1.default(achievementsRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const achievement = await achievementsRepository.create(fakeAchievement);
        const updatedAchievement = await updateAchievement.execute({
            gameId,
            id: achievement.id,
            name: 'New name',
            description: 'New description',
        });
        expect(updatedAchievement).not.toEqual(achievement);
    });
    it('should throw when trying to update a non existing achievement', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const updateAchievement = new UpdateAchievementService_1.default(achievementsRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        await expect(updateAchievement.execute(Object.assign(Object.assign({ gameId }, fakeAchievement), { id: 'invalid id', title: fakeAchievement.title }))).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
