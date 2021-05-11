"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fakes_1 = require("@modules/games/fakes");
const FakeActivitiesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeActivitiesRepository"));
const FakeGamesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeGamesRepository"));
const FakeTransactionProvider_1 = __importDefault(require("@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider"));
const FakePlayer_1 = __importDefault(require("../fakes/FakePlayer"));
const FakeCompleteActivityRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeCompleteActivityRequestRepository"));
const FakeFeedPostsRepository_1 = __importDefault(require("../repositories/fakes/FakeFeedPostsRepository"));
const FakeLeaderboardsRepository_1 = __importDefault(require("../repositories/fakes/FakeLeaderboardsRepository"));
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const CompleteActivityService_1 = __importDefault(require("./CompleteActivityService"));
const FakeCompleteActivityRequest_1 = __importDefault(require("../fakes/FakeCompleteActivityRequest"));
const implementations_1 = require("@shared/errors/implementations");
const initService = async () => {
    const playersRepository = new FakePlayersRepository_1.default();
    const activitiesRepository = new FakeActivitiesRepository_1.default();
    const feedPostsRepository = new FakeFeedPostsRepository_1.default();
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository_1.default();
    const leaderboardsRepository = new FakeLeaderboardsRepository_1.default();
    const gamesRepository = new FakeGamesRepository_1.default();
    const transactionProvider = new FakeTransactionProvider_1.default();
    const completeActivity = new CompleteActivityService_1.default(playersRepository, activitiesRepository, feedPostsRepository, completeActivityRequestRepository, leaderboardsRepository, gamesRepository, transactionProvider);
    const userId = uuid_1.v4();
    const fakeGame = new fakes_1.FakeGame();
    fakeGame.levelInfo.push({
        level: 1,
        requiredExperience: 0,
    }, {
        level: 2,
        requiredExperience: 300,
    }, {
        level: 3,
        requiredExperience: 400,
    }, {
        level: 4,
        requiredExperience: 600,
    });
    fakeGame.ranks.push({
        level: 4,
        color: '#000',
        name: 'Rank',
        tag: 'RNK',
    }, {
        level: 3,
        color: '#000',
        name: 'Rank',
        tag: 'RNK',
    });
    const game = await gamesRepository.create(fakeGame);
    const fakePlayer = new FakePlayer_1.default(userId, game.id);
    fakePlayer.experience = 0;
    fakePlayer.level = 1;
    const player = await playersRepository.create(fakePlayer);
    return {
        userId,
        completeActivity,
        game,
        player,
        playersRepository,
        activitiesRepository,
        completeActivityRequestRepository,
        leaderboardsRepository,
    };
};
describe('CompleteActivityService', () => {
    it('should correctly complete the activity, granting the player experience, removing the request, and adding it to the leaderboard', async () => {
        const { userId, completeActivity, player, game, playersRepository, activitiesRepository, completeActivityRequestRepository, leaderboardsRepository, } = await initService();
        const fakeActivity = new fakes_1.FakeActivity(game.id);
        fakeActivity.experience = 200;
        const activity = await activitiesRepository.create(fakeActivity);
        const fakeRequest = new FakeCompleteActivityRequest_1.default(player.id, activity.id, game.id);
        const request = await completeActivityRequestRepository.create(fakeRequest);
        await completeActivity.execute({ requestId: request.id, userId });
        const updatedPlayer = await playersRepository.findOne(player.id, userId, game.id);
        expect(updatedPlayer === null || updatedPlayer === void 0 ? void 0 : updatedPlayer.experience).toBe(activity.experience);
        const leaderboard = await leaderboardsRepository.getGameCurrentRanking(game.id);
        expect(leaderboard === null || leaderboard === void 0 ? void 0 : leaderboard.position).toHaveLength(1);
        expect(leaderboard === null || leaderboard === void 0 ? void 0 : leaderboard.position).toContainEqual({
            experience: activity.experience,
            player: player.id,
        });
        const deletedRequest = await completeActivityRequestRepository.findOne(request.id);
        expect(deletedRequest).toBeUndefined();
    });
    it('should level up the player on finishing the activity twice, and increase the players rank on the leaderboard', async () => {
        const { userId, completeActivity, player, game, playersRepository, activitiesRepository, completeActivityRequestRepository, leaderboardsRepository, } = await initService();
        const fakeActivity = new fakes_1.FakeActivity(game.id);
        fakeActivity.experience = 350;
        const activity = await activitiesRepository.create(fakeActivity);
        const fakeRequest = new FakeCompleteActivityRequest_1.default(player.id, activity.id, game.id);
        const firstRequest = await completeActivityRequestRepository.create(fakeRequest);
        const secondRequest = await completeActivityRequestRepository.create(fakeRequest);
        await completeActivity.execute({ requestId: firstRequest.id, userId });
        await completeActivity.execute({ requestId: secondRequest.id, userId });
        const updatedPlayer = await playersRepository.findOne(player.id, userId, game.id);
        expect(updatedPlayer === null || updatedPlayer === void 0 ? void 0 : updatedPlayer.experience).toBe(activity.experience * 2);
        expect(updatedPlayer === null || updatedPlayer === void 0 ? void 0 : updatedPlayer.level).toBe(game.levelInfo[0].level);
        expect(updatedPlayer === null || updatedPlayer === void 0 ? void 0 : updatedPlayer.rank).toEqual(game.ranks[0]);
        const leaderboard = await leaderboardsRepository.getGameCurrentRanking(game.id);
        expect(leaderboard === null || leaderboard === void 0 ? void 0 : leaderboard.position).toHaveLength(1);
        expect(leaderboard === null || leaderboard === void 0 ? void 0 : leaderboard.position).toContainEqual({
            experience: activity.experience * 2,
            player: player.id,
        });
    });
    it('should throw when trying to complete a non existing request', async () => {
        const { completeActivity, userId } = await initService();
        await expect(completeActivity.execute({ requestId: 'non-existing', userId })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
