"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const uuid_1 = require("uuid");
const FakeGame_1 = __importDefault(require("../fakes/FakeGame"));
const FakeGamesRepository_1 = __importDefault(require("../repositories/fakes/FakeGamesRepository"));
const UpdateGameService_1 = __importDefault(require("./UpdateGameService"));
describe('UpdateGameService', () => {
    it('should update the game correctly', async () => {
        const gamesRepository = new FakeGamesRepository_1.default();
        const updateGame = new UpdateGameService_1.default(gamesRepository);
        const adminId = uuid_1.v4();
        const fakeGame = new FakeGame_1.default();
        fakeGame.administrators = [adminId];
        const game = await gamesRepository.create(fakeGame);
        const updatedGame = await updateGame.execute({
            adminId,
            id: game.id,
            name: 'New name',
            description: 'New description',
            levelInfo: [{ level: 1, requiredExperience: 10 }],
            theme: { primary: '#AAAAAA', secondary: '#550033' },
            ranks: [{ color: '#0000BB', level: 3, name: 'My rank', tag: 'MRK' }],
        });
        expect(updatedGame).not.toEqual(game);
    });
    it('should throw when trying to update a non existing game', async () => {
        const gamesRepository = new FakeGamesRepository_1.default();
        const updateGame = new UpdateGameService_1.default(gamesRepository);
        const adminId = uuid_1.v4();
        const fakeGame = new FakeGame_1.default();
        await expect(updateGame.execute(Object.assign(Object.assign({ adminId }, fakeGame), { id: 'invalid id' }))).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
