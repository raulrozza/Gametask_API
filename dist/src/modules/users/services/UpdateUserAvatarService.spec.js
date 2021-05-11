"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeStorageProvider_1 = __importDefault(require("@shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));
const _1 = require(".");
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const FakeUser_1 = __importDefault(require("../fakes/FakeUser"));
const implementations_1 = require("@shared/errors/implementations");
const getService = () => {
    const usersRepository = new FakeUsersRepository_1.default();
    const storageProvider = new FakeStorageProvider_1.default();
    const updateUserAvatar = new _1.UpdateUserAvatarService(usersRepository, storageProvider);
    return { updateUserAvatar, storageProvider, usersRepository };
};
describe('UpdateUserAvatar', () => {
    it('should upload the user avatar', async () => {
        const { updateUserAvatar, usersRepository } = getService();
        const fakeUser = new FakeUser_1.default();
        const user = await usersRepository.create(fakeUser);
        const filename = 'avatar.jpg';
        const updatedUser = await updateUserAvatar.execute({
            filename,
            id: user.id,
        });
        expect(updatedUser.image).toBe(filename);
    });
    it('should update the user avatar and delete the old one', async () => {
        const { updateUserAvatar, storageProvider, usersRepository } = getService();
        const deleteFile = jest.spyOn(storageProvider, 'deleteFile');
        const fakeUser = new FakeUser_1.default();
        const user = await usersRepository.create(fakeUser);
        const filename = 'avatar.jpg';
        await updateUserAvatar.execute({ filename: 'first_file', id: user.id });
        const updatedUser = await updateUserAvatar.execute({
            filename,
            id: user.id,
        });
        expect(deleteFile).toHaveBeenCalledWith('first_file', 'user');
        expect(updatedUser.image).toBe(filename);
    });
    it('should throw when sending an invalid id', async () => {
        const { updateUserAvatar } = getService();
        await expect(updateUserAvatar.execute({ filename: 'avatar.jpg', id: 'invalid id' })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
