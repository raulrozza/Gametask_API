"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeGamesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeGamesRepository"));
const FakeUnlockAchievementRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeUnlockAchievementRequestRepository"));
const DeleteUnlockAchievementRequestService_1 = __importDefault(require("./DeleteUnlockAchievementRequestService"));
const FakeUnlockAchievementRequest_1 = __importDefault(require("../fakes/FakeUnlockAchievementRequest"));
const implementations_1 = require("@shared/errors/implementations");
const fakes_1 = require("@modules/games/fakes");
const FakeTransactionProvider_1 = __importDefault(require("@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider"));
describe('DeleteUnlockAchievementRequestService', () => {
    it('should successfully delete the request', async () => {
        const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository_1.default();
        const gamesRepository = new FakeGamesRepository_1.default();
        const transactionProvider = new FakeTransactionProvider_1.default();
        const deleteUnlockAchievementRequest = new DeleteUnlockAchievementRequestService_1.default(unlockAchievementRequestRepository, gamesRepository, transactionProvider);
        const fakeGame = new fakes_1.FakeGame();
        const game = await gamesRepository.create(fakeGame);
        const requesterId = uuid_1.v4();
        const achievementId = uuid_1.v4();
        const fakeAchievementRequest = new FakeUnlockAchievementRequest_1.default(game.id, requesterId, achievementId);
        const request = await unlockAchievementRequestRepository.create(fakeAchievementRequest);
        await deleteUnlockAchievementRequest.execute({
            gameId: game.id,
            requestId: request.id,
        });
        const requestsList = await unlockAchievementRequestRepository.findAllFromGame(game.id);
        expect(requestsList).toHaveLength(0);
    });
    it('should throw when trying to delete a non existing game', async () => {
        const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository_1.default();
        const gamesRepository = new FakeGamesRepository_1.default();
        const transactionProvider = new FakeTransactionProvider_1.default();
        const deleteUnlockAchievementRequest = new DeleteUnlockAchievementRequestService_1.default(unlockAchievementRequestRepository, gamesRepository, transactionProvider);
        const id = uuid_1.v4();
        const fakeRequest = new FakeUnlockAchievementRequest_1.default(id, id, id);
        const request = await unlockAchievementRequestRepository.create(fakeRequest);
        await expect(deleteUnlockAchievementRequest.execute({
            gameId: 'invalid-id',
            requestId: request.id,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when trying to delete a non existing request', async () => {
        const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository_1.default();
        const gamesRepository = new FakeGamesRepository_1.default();
        const transactionProvider = new FakeTransactionProvider_1.default();
        const deleteUnlockAchievementRequest = new DeleteUnlockAchievementRequestService_1.default(unlockAchievementRequestRepository, gamesRepository, transactionProvider);
        const fakeGame = new fakes_1.FakeGame();
        const game = await gamesRepository.create(fakeGame);
        await expect(deleteUnlockAchievementRequest.execute({
            gameId: game.id,
            requestId: 'invalid id',
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
