"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUser_1 = __importDefault(require("@modules/users/fakes/FakeUser"));
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const fakes_1 = require("@modules/games/fakes");
const FakeGamesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeGamesRepository"));
const _1 = require(".");
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const implementations_1 = require("@shared/errors/implementations");
const initService = async (addRanks = false) => {
    const playersRepository = new FakePlayersRepository_1.default();
    const usersRepository = new FakeUsersRepository_1.default();
    const gamesRepository = new FakeGamesRepository_1.default();
    const createPlayers = new _1.CreatePlayerService(playersRepository, gamesRepository, usersRepository);
    const _a = new FakeUser_1.default(), { id: _ } = _a, fakeUser = __rest(_a, ["id"]);
    const user = await usersRepository.create(fakeUser);
    const _b = new fakes_1.FakeGame(), { id: __ } = _b, fakeGame = __rest(_b, ["id"]);
    if (addRanks) {
        fakeGame.levelInfo = [
            {
                level: 1,
                requiredExperience: 300,
            },
            {
                level: 2,
                requiredExperience: 500,
            },
        ];
        fakeGame.ranks =
            typeof addRanks === 'boolean'
                ? [
                    {
                        color: '#000',
                        level: 1,
                        name: 'Rank1',
                        tag: 'RNK',
                    },
                    {
                        color: '#000',
                        level: 2,
                        name: 'Rank2',
                        tag: 'RNK',
                    },
                ]
                : addRanks;
    }
    const game = await gamesRepository.create(fakeGame);
    return { createPlayers, gameId: game.id, userId: user.id };
};
describe('CreatePlayerService', () => {
    it('should create the player successfully', async () => {
        const { createPlayers, gameId, userId } = await initService();
        const player = await createPlayers.execute({ userId, gameId });
        expect(player.game).toBe(gameId);
        expect(player.user).toBe(userId);
        expect(player.level).toBe(0);
    });
    it('should create the player successfully and assign the initialRank to it', async () => {
        const { createPlayers, gameId, userId } = await initService([
            {
                color: '#000',
                level: 2,
                name: 'Rank2',
                tag: 'RNK',
            },
        ]);
        const player = await createPlayers.execute({ userId, gameId });
        expect(player.level).toBe(1);
    });
    it('should throw when creating a player with a unexisting user', async () => {
        const { createPlayers, gameId } = await initService();
        await expect(createPlayers.execute({ userId: 'fake-user', gameId })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when creating a player on a unexisting game', async () => {
        const { createPlayers, userId } = await initService();
        await expect(createPlayers.execute({ gameId: 'fake-game', userId })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when trying to create a player when a player already exists matching user and game', async () => {
        const { createPlayers, gameId, userId } = await initService(true);
        await createPlayers.execute({ userId, gameId });
        await expect(createPlayers.execute({ userId, gameId })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
