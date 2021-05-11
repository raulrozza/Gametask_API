"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakePlayer_1 = __importDefault(require("../fakes/FakePlayer"));
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const ShowPlayerService_1 = __importDefault(require("./ShowPlayerService"));
describe('ShowPlayerService', () => {
    it('should return the players information', async () => {
        const playersRepository = new FakePlayersRepository_1.default();
        const showPlayer = new ShowPlayerService_1.default(playersRepository);
        const userId = uuid_1.v4();
        const gameId = uuid_1.v4();
        const fakePlayer = new FakePlayer_1.default(userId, gameId);
        const createdPlayer = await playersRepository.create(fakePlayer);
        const player = await showPlayer.execute({
            id: createdPlayer.id,
            userId,
            gameId,
        });
        expect(player).toBe(createdPlayer);
    });
    it('should return undefined when the players information is wrong', async () => {
        const playersRepository = new FakePlayersRepository_1.default();
        const showPlayer = new ShowPlayerService_1.default(playersRepository);
        const player = await showPlayer.execute({
            id: 'wrong',
            userId: 'wrong',
            gameId: 'wrong',
        });
        expect(player).toBeUndefined();
    });
});
