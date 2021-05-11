"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fakes_1 = require("../fakes");
const FakeAchievementsRepository_1 = __importDefault(require("../repositories/fakes/FakeAchievementsRepository"));
const DeleteAchievementService_1 = __importDefault(require("./DeleteAchievementService"));
describe('DeleteAchievementService', () => {
    it('should delete the right achievement', async () => {
        const achievementsRepository = new FakeAchievementsRepository_1.default();
        const deleteAchievement = new DeleteAchievementService_1.default(achievementsRepository);
        const gameId = uuid_1.v4();
        const fakeAchievement = new fakes_1.FakeAchievement(gameId);
        await achievementsRepository.create({
            game: fakeAchievement.game,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
        });
        const achievementToBeDeleted = await achievementsRepository.create({
            game: fakeAchievement.game,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
        });
        await achievementsRepository.create({
            game: fakeAchievement.game,
            name: fakeAchievement.name,
            description: fakeAchievement.description,
        });
        await deleteAchievement.execute({ gameId, id: achievementToBeDeleted.id });
        const achievements = await achievementsRepository.findAllFromGame(gameId);
        expect(achievements).toHaveLength(2);
        expect(achievements).not.toContainEqual(achievementToBeDeleted);
    });
});
