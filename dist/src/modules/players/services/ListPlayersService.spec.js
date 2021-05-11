"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakePlayer_1 = __importDefault(require("../fakes/FakePlayer"));
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const ListPlayersService_1 = __importDefault(require("./ListPlayersService"));
describe('ListPlayersService', () => {
    it('should list all games from the user', async () => {
        const playersRepository = new FakePlayersRepository_1.default();
        const listPlayers = new ListPlayersService_1.default(playersRepository);
        const userId = uuid_1.v4();
        const player = new FakePlayer_1.default(userId, 'game');
        await playersRepository.create(Object.assign(Object.assign({}, player), { game: 'game-01' }));
        await playersRepository.create(Object.assign(Object.assign({}, player), { game: 'game-02', user: 'user-id' }));
        await playersRepository.create(Object.assign(Object.assign({}, player), { game: 'game-03' }));
        const players = await listPlayers.execute(userId);
        expect(players).toHaveLength(2);
    });
});
