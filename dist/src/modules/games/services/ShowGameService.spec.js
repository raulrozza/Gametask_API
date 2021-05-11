"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeGame_1 = __importDefault(require("../fakes/FakeGame"));
const FakeGamesRepository_1 = __importDefault(require("../repositories/fakes/FakeGamesRepository"));
const ShowGameService_1 = __importDefault(require("./ShowGameService"));
describe('ShowGameService', () => {
    it('should return the correct game', async () => {
        const gamesRepository = new FakeGamesRepository_1.default();
        const showGames = new ShowGameService_1.default(gamesRepository);
        const userId = uuid_1.v4();
        const fakeGame = new FakeGame_1.default();
        const game = await gamesRepository.create({
            name: fakeGame.name,
            description: fakeGame.description,
            administrators: [userId],
        });
        const fetchedGame = await showGames.execute({
            gameId: game.id,
            userId,
        });
        expect(fetchedGame).toEqual(game);
    });
    it('should return undefined when trying to fetch a game you do not own', async () => {
        const gamesRepository = new FakeGamesRepository_1.default();
        const showGames = new ShowGameService_1.default(gamesRepository);
        const userId = uuid_1.v4();
        const fakeGame = new FakeGame_1.default();
        const game = await gamesRepository.create({
            name: fakeGame.name,
            description: fakeGame.description,
            administrators: ['random-user-id'],
        });
        const fetchedGame = await showGames.execute({
            gameId: game.id,
            userId,
        });
        expect(fetchedGame).toBeUndefined();
    });
});
