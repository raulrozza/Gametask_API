"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const FakeUser_1 = __importDefault(require("../fakes/FakeUser"));
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const FakeTokenProvider_1 = __importDefault(require("../providers/TokenProvider/fakes/FakeTokenProvider"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const AuthenticateUserService_1 = __importDefault(require("./AuthenticateUserService"));
const getService = () => {
    const usersRepository = new FakeUsersRepository_1.default();
    const hashProvider = new FakeHashProvider_1.default();
    const tokenProvider = new FakeTokenProvider_1.default();
    const authenticateUser = new AuthenticateUserService_1.default(usersRepository, hashProvider, tokenProvider);
    return {
        usersRepository,
        authenticateUser,
    };
};
describe('AuthenticateUser', () => {
    it('should authenticate the user', async () => {
        const { usersRepository, authenticateUser } = getService();
        const user = new FakeUser_1.default();
        await usersRepository.create(user);
        const response = await authenticateUser.execute({
            email: user.email,
            password: user.password,
        });
        expect(response).toHaveProperty('token');
    });
    it('should not be able to authenticate an user with an incorrect email', async () => {
        const { usersRepository, authenticateUser } = getService();
        const user = new FakeUser_1.default();
        await usersRepository.create(user);
        await expect(authenticateUser.execute({
            email: 'my incorrect email',
            password: user.password,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should not be able to authenticate an user with an incorrect password', async () => {
        const { usersRepository, authenticateUser } = getService();
        const user = new FakeUser_1.default();
        await usersRepository.create(user);
        await expect(authenticateUser.execute({
            email: user.email,
            password: 'my incorrect password',
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
