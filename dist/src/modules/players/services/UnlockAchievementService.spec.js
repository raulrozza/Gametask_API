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
const FakeAchievementsRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeAchievementsRepository"));
const FakeGamesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeGamesRepository"));
const FakeFeedPostsRepository_1 = __importDefault(require("../repositories/fakes/FakeFeedPostsRepository"));
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const FakeUnlockAchievementRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeUnlockAchievementRequestRepository"));
const UnlockAchievementService_1 = __importDefault(require("./UnlockAchievementService"));
const fakes_1 = require("@modules/games/fakes");
const FakePlayer_1 = __importDefault(require("../fakes/FakePlayer"));
const FakeUnlockAchievementRequest_1 = __importDefault(require("../fakes/FakeUnlockAchievementRequest"));
const implementations_1 = require("@shared/errors/implementations");
const FakeTransactionProvider_1 = __importDefault(require("@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider"));
const initService = async (title) => {
    const playersRepository = new FakePlayersRepository_1.default();
    const achievementsRepository = new FakeAchievementsRepository_1.default();
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository_1.default();
    const gamesRepository = new FakeGamesRepository_1.default();
    const feedPostsRepository = new FakeFeedPostsRepository_1.default();
    const transactionProvider = new FakeTransactionProvider_1.default();
    const unlockAchievement = new UnlockAchievementService_1.default(playersRepository, achievementsRepository, unlockAchievementRequestRepository, gamesRepository, feedPostsRepository, transactionProvider);
    const userId = uuid_1.v4();
    const _a = new fakes_1.FakeGame(), { id: _ } = _a, fakeGame = __rest(_a, ["id"]);
    const game = await gamesRepository.create(fakeGame);
    const _b = new fakes_1.FakeAchievement(game.id, title), { id: __ } = _b, fakeAchievement = __rest(_b, ["id"]);
    const achievement = await achievementsRepository.create(fakeAchievement);
    const _c = new FakePlayer_1.default(userId, game.id), { id: ___ } = _c, fakePlayer = __rest(_c, ["id"]);
    const player = await playersRepository.create(fakePlayer);
    const _d = new FakeUnlockAchievementRequest_1.default(game.id, player.id, achievement.id), { id: ____ } = _d, fakeRequest = __rest(_d, ["id"]);
    const request = await unlockAchievementRequestRepository.create(fakeRequest);
    return {
        userId,
        unlockAchievement,
        game,
        achievement,
        player,
        request,
        playersRepository,
        unlockAchievementRequestRepository,
    };
};
describe('UnlockAchievementService', () => {
    it('should unlock the achievement for the player, removing the unlock request', async () => {
        const { unlockAchievement, userId, game, achievement, player, request, playersRepository, unlockAchievementRequestRepository, } = await initService();
        await unlockAchievement.execute({
            achievementId: achievement.id,
            gameId: game.id,
            playerId: player.id,
            requestId: request.id,
            userId: userId,
        });
        const updatedPlayer = (await playersRepository.findOne(player.id, userId, game.id));
        expect(updatedPlayer.achievements).toContain(achievement.id);
        const deletedRequest = await unlockAchievementRequestRepository.findOne(request.id);
        expect(deletedRequest).toBeUndefined();
    });
    it('should throw when trying to unlock an unexisting achievement', async () => {
        const { unlockAchievement, game, userId, player, request, } = await initService();
        await expect(unlockAchievement.execute({
            achievementId: 'wrong-achievement',
            gameId: game.id,
            playerId: player.id,
            requestId: request.id,
            userId: userId,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when trying to unlock an achievement for a non existing player', async () => {
        const { unlockAchievement, userId, game, achievement, request, } = await initService();
        await expect(unlockAchievement.execute({
            achievementId: achievement.id,
            gameId: game.id,
            playerId: 'wrong player',
            requestId: request.id,
            userId: userId,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when trying to unlock an achievement that hasnt been requested', async () => {
        const { unlockAchievement, userId, game, achievement, player, } = await initService();
        await expect(unlockAchievement.execute({
            achievementId: achievement.id,
            gameId: game.id,
            playerId: player.id,
            requestId: 'wrong-request',
            userId: userId,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
