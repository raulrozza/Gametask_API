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
const uuid_1 = require("uuid");
const fakes_1 = require("@modules/games/fakes");
const FakeTitlesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeTitlesRepository"));
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const ChangeTitleService_1 = __importDefault(require("./ChangeTitleService"));
const FakePlayer_1 = __importDefault(require("../fakes/FakePlayer"));
const implementations_1 = require("@shared/errors/implementations");
const initService = async () => {
    const titlesRepository = new FakeTitlesRepository_1.default();
    const playersRepository = new FakePlayersRepository_1.default();
    const changeTitle = new ChangeTitleService_1.default(playersRepository, titlesRepository);
    const userId = uuid_1.v4();
    const gameId = uuid_1.v4();
    const _a = new fakes_1.FakeTitle(gameId), { id: _ } = _a, fakeTitle = __rest(_a, ["id"]);
    const _b = new FakePlayer_1.default(userId, gameId), { id: __ } = _b, fakePlayer = __rest(_b, ["id"]);
    const title = await titlesRepository.create(fakeTitle);
    const player = await playersRepository.create(fakePlayer);
    return {
        changeTitle,
        title,
        player,
        gameId,
        userId,
    };
};
describe('ChangeTitleService', () => {
    it('should successfully change the title to a new one', async () => {
        const { changeTitle, gameId, userId, title, player } = await initService();
        const updatedPlayer = await changeTitle.execute({
            gameId,
            userId,
            playerId: player.id,
            titleId: title.id,
        });
        expect(updatedPlayer.currentTitle).toBe(title.id);
    });
    it('should remove the current title when sending an empty titleId', async () => {
        const { changeTitle, gameId, userId, title, player } = await initService();
        await changeTitle.execute({
            gameId,
            userId,
            playerId: player.id,
            titleId: title.id,
        });
        const updatedPlayer = await changeTitle.execute({
            gameId,
            userId,
            playerId: player.id,
        });
        expect(updatedPlayer.currentTitle).toBeUndefined();
    });
    it('should throw when sending an invalid title id', async () => {
        const { changeTitle, gameId, userId, player } = await initService();
        await expect(changeTitle.execute({
            gameId,
            userId,
            playerId: player.id,
            titleId: 'invalid id',
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when sending an invalid player id', async () => {
        const { changeTitle, gameId, userId, title } = await initService();
        await expect(changeTitle.execute({
            gameId,
            userId,
            playerId: 'invalid id',
            titleId: title.id,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
