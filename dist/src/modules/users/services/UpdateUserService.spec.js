"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const FakeUser_1 = __importDefault(require("@modules/users/fakes/FakeUser"));
const UpdateUserService_1 = __importDefault(require("./UpdateUserService"));
const implementations_1 = require("@shared/errors/implementations");
describe('UpdateUserService', () => {
    it('should correclty update the user', async () => {
        const usersRepository = new FakeUsersRepository_1.default();
        const updateUser = new UpdateUserService_1.default(usersRepository);
        const user = new FakeUser_1.default();
        await usersRepository.create(user);
        const payload = {
            id: user.id,
            firstname: 'New name',
            lastname: 'New lastname',
        };
        const updatedUser = await updateUser.execute(payload);
        expect(updatedUser.id).toBe(user.id);
        expect(updatedUser.firstname).toBe('New name');
        expect(updatedUser.lastname).toBe('New lastname');
    });
    it('should throw an error when trying to update an invalid user', async () => {
        const usersRepository = new FakeUsersRepository_1.default();
        const updateUser = new UpdateUserService_1.default(usersRepository);
        const payload = {
            id: 'Invalid id',
            firstname: 'Invalid name',
            lastname: 'Invalid lastname',
        };
        await expect(updateUser.execute(payload)).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
