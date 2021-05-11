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
const FakeAchievementsRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeAchievementsRepository"));
const FakeGamesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeGamesRepository"));
const FakePlayer_1 = __importDefault(require("../fakes/FakePlayer"));
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const FakeUnlockAchievementRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeUnlockAchievementRequestRepository"));
const CreateUnlockAchievementRequestService_1 = __importDefault(require("./CreateUnlockAchievementRequestService"));
const FakeUnlockAchievementRequest_1 = __importDefault(require("../fakes/FakeUnlockAchievementRequest"));
const implementations_1 = require("@shared/errors/implementations");
const FakeTransactionProvider_1 = __importDefault(require("@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider"));
const initService = async () => {
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository_1.default();
    const gamesRepository = new FakeGamesRepository_1.default();
    const achievementsRepository = new FakeAchievementsRepository_1.default();
    const playersRepository = new FakePlayersRepository_1.default();
    const transactionProvider = new FakeTransactionProvider_1.default();
    const createUnlockAchievementRequest = new CreateUnlockAchievementRequestService_1.default(unlockAchievementRequestRepository, gamesRepository, achievementsRepository, playersRepository, transactionProvider);
    const userId = uuid_1.v4();
    const _a = new fakes_1.FakeGame(), { id: _ } = _a, fakeGame = __rest(_a, ["id"]);
    const game = await gamesRepository.create(fakeGame);
    const _b = new FakePlayer_1.default(userId, game.id), { id: __ } = _b, fakePlayer = __rest(_b, ["id"]);
    const player = await playersRepository.create(fakePlayer);
    const _c = new fakes_1.FakeAchievement(game.id), { id: ___ } = _c, fakeAchievement = __rest(_c, ["id"]);
    const achievement = await achievementsRepository.create(fakeAchievement);
    return {
        userId,
        createUnlockAchievementRequest,
        game,
        player,
        achievement,
        playersRepository,
    };
};
describe('CreateUnlockAchievementRequestService', () => {
    it('should request to unlock the achievement correctly', async () => {
        const { userId, createUnlockAchievementRequest, game, player, achievement, } = await initService();
        const fakeRequest = new FakeUnlockAchievementRequest_1.default(game.id, player.id, achievement.id);
        const request = await createUnlockAchievementRequest.execute({
            userId,
            achievement: fakeRequest.achievement,
            gameId: fakeRequest.game,
            requestDate: fakeRequest.requestDate,
            requester: fakeRequest.requester,
            information: fakeRequest.information,
        });
        expect(request).toHaveProperty('id');
        expect(request.game).toBe(fakeRequest.game);
        expect(request.requester).toBe(fakeRequest.requester);
        expect(request.achievement).toBe(fakeRequest.achievement);
    });
    it('should not be able to request the unlock of the same achievement twice', async () => {
        const { userId, createUnlockAchievementRequest, game, player, achievement, } = await initService();
        const fakeRequest = new FakeUnlockAchievementRequest_1.default(game.id, player.id, achievement.id);
        await createUnlockAchievementRequest.execute({
            userId,
            achievement: fakeRequest.achievement,
            gameId: fakeRequest.game,
            requestDate: fakeRequest.requestDate,
            requester: fakeRequest.requester,
            information: fakeRequest.information,
        });
        await expect(createUnlockAchievementRequest.execute({
            userId,
            achievement: fakeRequest.achievement,
            gameId: fakeRequest.game,
            requestDate: fakeRequest.requestDate,
            requester: fakeRequest.requester,
            information: fakeRequest.information,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should not be able to request the unlock of an achievement the player already possesses', async () => {
        const { userId, createUnlockAchievementRequest, game, player, achievement, playersRepository, } = await initService();
        player.achievements.push(achievement.id);
        await playersRepository.update(player);
        const fakeRequest = new FakeUnlockAchievementRequest_1.default(game.id, player.id, achievement.id);
        await expect(createUnlockAchievementRequest.execute({
            userId,
            achievement: fakeRequest.achievement,
            gameId: fakeRequest.game,
            requestDate: fakeRequest.requestDate,
            requester: fakeRequest.requester,
            information: fakeRequest.information,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should not be able to request the unlock of an unexisting achievement', async () => {
        const { userId, createUnlockAchievementRequest, game, player, } = await initService();
        const fakeRequest = new FakeUnlockAchievementRequest_1.default(game.id, player.id, 'invalid achievement id');
        await expect(createUnlockAchievementRequest.execute({
            userId,
            achievement: fakeRequest.achievement,
            gameId: fakeRequest.game,
            requestDate: fakeRequest.requestDate,
            requester: fakeRequest.requester,
            information: fakeRequest.information,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should not be allow an unexisting player to make a request', async () => {
        const { userId, createUnlockAchievementRequest, game, achievement, } = await initService();
        const fakeRequest = new FakeUnlockAchievementRequest_1.default(game.id, 'invalid player id', achievement.id);
        await expect(createUnlockAchievementRequest.execute({
            userId,
            achievement: fakeRequest.achievement,
            gameId: fakeRequest.game,
            requestDate: fakeRequest.requestDate,
            requester: fakeRequest.requester,
            information: fakeRequest.information,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should not be able to make a request to a non existing game', async () => {
        const { userId, createUnlockAchievementRequest, player, achievement, } = await initService();
        const fakeRequest = new FakeUnlockAchievementRequest_1.default('invalid game id', player.id, achievement.id);
        await expect(createUnlockAchievementRequest.execute({
            userId,
            achievement: fakeRequest.achievement,
            gameId: fakeRequest.game,
            requestDate: fakeRequest.requestDate,
            requester: fakeRequest.requester,
            information: fakeRequest.information,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
