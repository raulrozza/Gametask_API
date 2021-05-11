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
const FakeGamesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeGamesRepository"));
const FakeCompleteActivityRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeCompleteActivityRequestRepository"));
const CreateCompleteActivityRequestService_1 = __importDefault(require("./CreateCompleteActivityRequestService"));
const FakeActivitiesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeActivitiesRepository"));
const FakeCompleteActivityRequest_1 = __importDefault(require("../fakes/FakeCompleteActivityRequest"));
const FakePlayersRepository_1 = __importDefault(require("../repositories/fakes/FakePlayersRepository"));
const FakePlayer_1 = __importDefault(require("../fakes/FakePlayer"));
const implementations_1 = require("@shared/errors/implementations");
const FakeTransactionProvider_1 = __importDefault(require("@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider"));
const initService = async () => {
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository_1.default();
    const gamesRepository = new FakeGamesRepository_1.default();
    const activitiesRepository = new FakeActivitiesRepository_1.default();
    const playersRepository = new FakePlayersRepository_1.default();
    const transactionProvider = new FakeTransactionProvider_1.default();
    const createCompleteActivity = new CreateCompleteActivityRequestService_1.default(completeActivityRequestRepository, gamesRepository, activitiesRepository, playersRepository, transactionProvider);
    const userId = uuid_1.v4();
    const _a = new fakes_1.FakeGame(), { id: _ } = _a, fakeGame = __rest(_a, ["id"]);
    const game = await gamesRepository.create(fakeGame);
    const _b = new fakes_1.FakeActivity(game.id), { id: __ } = _b, fakeActivity = __rest(_b, ["id"]);
    const activity = await activitiesRepository.create(fakeActivity);
    const _c = new FakePlayer_1.default(userId, game.id), { id: ___ } = _c, fakePlayer = __rest(_c, ["id"]);
    const player = await playersRepository.create(fakePlayer);
    return {
        userId,
        createCompleteActivity,
        game,
        activity,
        player,
    };
};
describe('CreateCompleteActivityRequestService', () => {
    it('should create an complete activity request successfully', async () => {
        const { userId, createCompleteActivity, activity, game, player, } = await initService();
        const fakeCompleteActivity = new FakeCompleteActivityRequest_1.default(player.id, activity.id, game.id);
        const request = await createCompleteActivity.execute({
            userId,
            activity: fakeCompleteActivity.activity,
            gameId: fakeCompleteActivity.game,
            requester: fakeCompleteActivity.requester,
            completionDate: fakeCompleteActivity.completionDate,
            information: fakeCompleteActivity.information,
            requestDate: fakeCompleteActivity.requestDate,
        });
        expect(request).toHaveProperty('id');
        expect(request.game).toBe(fakeCompleteActivity.game);
        expect(request.activity).toBe(fakeCompleteActivity.activity);
        expect(request.requester).toBe(fakeCompleteActivity.requester);
    });
    it('should throw when trying to make a request to a non existing game', async () => {
        const { userId, createCompleteActivity, activity, player, } = await initService();
        const fakeCompleteActivity = new FakeCompleteActivityRequest_1.default(player.id, activity.id, 'invalid game');
        await expect(createCompleteActivity.execute({
            userId,
            activity: fakeCompleteActivity.activity,
            gameId: fakeCompleteActivity.game,
            requester: fakeCompleteActivity.requester,
            completionDate: fakeCompleteActivity.completionDate,
            information: fakeCompleteActivity.information,
            requestDate: fakeCompleteActivity.requestDate,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when trying to request to a unknown activity', async () => {
        const { userId, createCompleteActivity, game, player, } = await initService();
        const fakeCompleteActivity = new FakeCompleteActivityRequest_1.default(player.id, 'invalid activity', game.id);
        await expect(createCompleteActivity.execute({
            userId,
            activity: fakeCompleteActivity.activity,
            gameId: fakeCompleteActivity.game,
            requester: fakeCompleteActivity.requester,
            completionDate: fakeCompleteActivity.completionDate,
            information: fakeCompleteActivity.information,
            requestDate: fakeCompleteActivity.requestDate,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when the requesting player does is invalid', async () => {
        const { userId, createCompleteActivity, activity, game, } = await initService();
        const fakeCompleteActivity = new FakeCompleteActivityRequest_1.default('invalid player', activity.id, game.id);
        await expect(createCompleteActivity.execute({
            userId,
            activity: fakeCompleteActivity.activity,
            gameId: fakeCompleteActivity.game,
            requester: fakeCompleteActivity.requester,
            completionDate: fakeCompleteActivity.completionDate,
            information: fakeCompleteActivity.information,
            requestDate: fakeCompleteActivity.requestDate,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
