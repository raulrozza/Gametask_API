"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const faker_1 = __importDefault(require("faker"));
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const CreateUsersService_1 = __importDefault(require("./CreateUsersService"));
const getService = () => {
    const usersRepository = new FakeUsersRepository_1.default();
    const hashProvider = new FakeHashProvider_1.default();
    const service = new CreateUsersService_1.default(usersRepository, hashProvider);
    return service;
};
describe('CreateUsersService', () => {
    it('should create an user correctly', async () => {
        const createUsers = getService();
        const payload = {
            firstname: faker_1.default.name.firstName(),
            lastname: faker_1.default.name.lastName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.random.alphaNumeric(6),
        };
        const newUser = await createUsers.execute(payload);
        expect(newUser).toHaveProperty('id');
        expect(newUser.firstname).toBe(payload.firstname);
    });
    it('should not be able to create a user with an existing email', async () => {
        const createUsers = getService();
        const payload = {
            firstname: faker_1.default.name.firstName(),
            lastname: faker_1.default.name.lastName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.random.alphaNumeric(6),
        };
        await createUsers.execute(payload);
        await expect(createUsers.execute(payload)).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
