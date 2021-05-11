"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const ShowUsersService_1 = __importDefault(require("./ShowUsersService"));
describe('ShowUsersService', () => {
    it('should return the correct user', async () => {
        const usersRepository = new FakeUsersRepository_1.default();
        const showUsers = new ShowUsersService_1.default(usersRepository);
        const user = await usersRepository.create({
            firstname: faker_1.default.name.firstName(),
            lastname: faker_1.default.name.lastName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.random.alphaNumeric(6),
        });
        const fetchedUser = await showUsers.execute(user.id);
        expect(fetchedUser).toEqual(user);
    });
});
