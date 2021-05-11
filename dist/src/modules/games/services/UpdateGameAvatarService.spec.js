"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeStorageProvider_1 = __importDefault(require("@shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));
const implementations_1 = require("@shared/errors/implementations");
const FakeGame_1 = __importDefault(require("../fakes/FakeGame"));
const FakeGamesRepository_1 = __importDefault(require("../repositories/fakes/FakeGamesRepository"));
const UpdateGameAvatarService_1 = __importDefault(require("./UpdateGameAvatarService"));
const getService = () => {
    const gamesRepository = new FakeGamesRepository_1.default();
    const storageProvider = new FakeStorageProvider_1.default();
    const updateGameAvatar = new UpdateGameAvatarService_1.default(gamesRepository, storageProvider);
    return { updateGameAvatar, storageProvider, gamesRepository };
};
describe('UpdateGameAvatar', () => {
    it('should upload the game avatar', async () => {
        const { updateGameAvatar, gamesRepository } = getService();
        const fakeGame = new FakeGame_1.default();
        fakeGame.administrators = ['fake_id'];
        const game = await gamesRepository.create(fakeGame);
        const filename = 'avatar.jpg';
        const updatedGame = await updateGameAvatar.execute({
            filename,
            id: game.id,
            userId: 'fake_id',
        });
        expect(updatedGame.image).toBe(filename);
    });
    it('should update the game avatar and delete the old one', async () => {
        const { updateGameAvatar, storageProvider, gamesRepository } = getService();
        const deleteFile = jest.spyOn(storageProvider, 'deleteFile');
        const fakeGame = new FakeGame_1.default();
        fakeGame.administrators = ['fake_id'];
        const game = await gamesRepository.create(fakeGame);
        const filename = 'avatar.jpg';
        await updateGameAvatar.execute({
            filename: 'first_file',
            id: game.id,
            userId: 'fake_id',
        });
        const updatedGame = await updateGameAvatar.execute({
            filename,
            id: game.id,
            userId: 'fake_id',
        });
        expect(deleteFile).toHaveBeenCalledWith('first_file', 'game');
        expect(updatedGame.image).toBe(filename);
    });
    it('should throw when sending an invalid id', async () => {
        const { updateGameAvatar } = getService();
        await expect(updateGameAvatar.execute({
            filename: 'avatar.jpg',
            id: 'invalid id',
            userId: 'invalid id',
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
