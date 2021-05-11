"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeGame_1 = __importDefault(require("../fakes/FakeGame"));
const FakeGamesRepository_1 = __importDefault(require("../repositories/fakes/FakeGamesRepository"));
const CreateGameService_1 = __importDefault(require("./CreateGameService"));
describe('CreateGameService', () => {
    it('should create the game', async () => {
        const gamesRepository = new FakeGamesRepository_1.default();
        const createGame = new CreateGameService_1.default(gamesRepository);
        const fakeGame = new FakeGame_1.default();
        const creatorId = uuid_1.v4();
        const payload = {
            creatorId,
            name: fakeGame.name,
            description: fakeGame.description,
        };
        const game = await createGame.execute(payload);
        expect(game).toHaveProperty('id');
        expect(game.name).toBe(fakeGame.name);
        expect(game.description).toBe(fakeGame.description);
        expect(game.administrators).toContain(creatorId);
    });
});
