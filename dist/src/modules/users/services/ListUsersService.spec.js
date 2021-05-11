"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
describe('ListUsersService', () => {
    it('should list both the users created', async () => {
        const usersRepository = new FakeUsersRepository_1.default();
        const listUsers = new _1.ListUsersService(usersRepository);
        const payload = [0, 0].map(() => ({
            firstname: faker_1.default.name.firstName(),
            lastname: faker_1.default.name.lastName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.random.alphaNumeric(6),
        }));
        await usersRepository.create(payload[0]);
        await usersRepository.create(payload[1]);
        const users = await listUsers.execute();
        expect(users).toHaveLength(2);
    });
});
