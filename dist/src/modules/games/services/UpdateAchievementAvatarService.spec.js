"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeStorageProvider_1 = __importDefault(require("@shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));
const implementations_1 = require("@shared/errors/implementations");
const FakeAchievement_1 = __importDefault(require("../fakes/FakeAchievement"));
const FakeAchievementsRepository_1 = __importDefault(require("../repositories/fakes/FakeAchievementsRepository"));
const UpdateAchievementAvatarService_1 = __importDefault(require("./UpdateAchievementAvatarService"));
const getService = () => {
    const achievementsRepository = new FakeAchievementsRepository_1.default();
    const storageProvider = new FakeStorageProvider_1.default();
    const updateAchievementAvatar = new UpdateAchievementAvatarService_1.default(achievementsRepository, storageProvider);
    return { updateAchievementAvatar, storageProvider, achievementsRepository };
};
describe('UpdateAchievementAvatar', () => {
    it('should upload the achievement avatar', async () => {
        const { updateAchievementAvatar, achievementsRepository } = getService();
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const achievement = await achievementsRepository.create(fakeAchievement);
        const filename = 'avatar.jpg';
        const updatedAchievement = await updateAchievementAvatar.execute({
            filename,
            id: achievement.id,
            gameId,
        });
        expect(updatedAchievement.image).toBe(filename);
    });
    it('should update the achievement avatar and delete the old one', async () => {
        const { updateAchievementAvatar, storageProvider, achievementsRepository, } = getService();
        const deleteFile = jest.spyOn(storageProvider, 'deleteFile');
        const gameId = uuid_1.v4();
        const fakeAchievement = new FakeAchievement_1.default(gameId);
        const achievement = await achievementsRepository.create(fakeAchievement);
        const filename = 'avatar.jpg';
        await updateAchievementAvatar.execute({
            filename: 'first_file',
            id: achievement.id,
            gameId,
        });
        const updatedAchievement = await updateAchievementAvatar.execute({
            filename,
            id: achievement.id,
            gameId,
        });
        expect(deleteFile).toHaveBeenCalledWith('first_file', 'achievement');
        expect(updatedAchievement.image).toBe(filename);
    });
    it('should throw when sending an invalid id', async () => {
        const { updateAchievementAvatar } = getService();
        await expect(updateAchievementAvatar.execute({
            filename: 'avatar.jpg',
            id: 'invalid id',
            gameId: 'invalid id',
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
