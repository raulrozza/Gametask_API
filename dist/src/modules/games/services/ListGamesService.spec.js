"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeGame_1 = __importDefault(require("../fakes/FakeGame"));
const FakeGamesRepository_1 = __importDefault(require("../repositories/fakes/FakeGamesRepository"));
const ListGamesService_1 = __importDefault(require("./ListGamesService"));
describe('ListGamesService', () => {
    it('should list only the user owned games', async () => {
        const gamesRepository = new FakeGamesRepository_1.default();
        const listGames = new ListGamesService_1.default(gamesRepository);
        const userId = uuid_1.v4();
        const fakeGame = new FakeGame_1.default();
        await gamesRepository.create({
            administrators: [userId],
            name: fakeGame.name,
            description: fakeGame.description,
        });
        await gamesRepository.create({
            administrators: [userId],
            name: fakeGame.name,
            description: fakeGame.description,
        });
        await gamesRepository.create({
            administrators: ['not-my-game-id'],
            name: fakeGame.name,
            description: fakeGame.description,
        });
        const games = await listGames.execute(userId);
        expect(games).toHaveLength(2);
    });
});
