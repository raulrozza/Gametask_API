"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeGamesRepository_1 = __importDefault(require("@modules/games/repositories/fakes/FakeGamesRepository"));
const FakeCompleteActivityRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeCompleteActivityRequestRepository"));
const DeleteCompleteActivityRequestService_1 = __importDefault(require("./DeleteCompleteActivityRequestService"));
const FakeCompleteActivityRequest_1 = __importDefault(require("../fakes/FakeCompleteActivityRequest"));
const implementations_1 = require("@shared/errors/implementations");
const fakes_1 = require("@modules/games/fakes");
const FakeTransactionProvider_1 = __importDefault(require("@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider"));
describe('DeleteCompleteActivityRequest', () => {
    it('should successfully delete the request', async () => {
        const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository_1.default();
        const gamesRepository = new FakeGamesRepository_1.default();
        const transactionProvider = new FakeTransactionProvider_1.default();
        const deleteUnlockAchievementRequest = new DeleteCompleteActivityRequestService_1.default(completeActivityRequestRepository, gamesRepository, transactionProvider);
        const fakeGame = new fakes_1.FakeGame();
        const game = await gamesRepository.create(fakeGame);
        const requesterId = uuid_1.v4();
        const achievementId = uuid_1.v4();
        const fakeActivityRequest = new FakeCompleteActivityRequest_1.default(game.id, requesterId, achievementId);
        const request = await completeActivityRequestRepository.create(fakeActivityRequest);
        await deleteUnlockAchievementRequest.execute({
            gameId: game.id,
            requestId: request.id,
        });
        const requestsList = await completeActivityRequestRepository.findAllFromGame(game.id);
        expect(requestsList).toHaveLength(0);
    });
    it('should throw when trying to delete a non existing game', async () => {
        const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository_1.default();
        const gamesRepository = new FakeGamesRepository_1.default();
        const transactionProvider = new FakeTransactionProvider_1.default();
        const deleteUnlockAchievementRequest = new DeleteCompleteActivityRequestService_1.default(completeActivityRequestRepository, gamesRepository, transactionProvider);
        const id = uuid_1.v4();
        const fakeRequest = new FakeCompleteActivityRequest_1.default(id, id, id);
        const request = await completeActivityRequestRepository.create(fakeRequest);
        await expect(deleteUnlockAchievementRequest.execute({
            gameId: 'invalid-id',
            requestId: request.id,
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
    it('should throw when trying to delete a non existing request', async () => {
        const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository_1.default();
        const gamesRepository = new FakeGamesRepository_1.default();
        const transactionProvider = new FakeTransactionProvider_1.default();
        const deleteUnlockAchievementRequest = new DeleteCompleteActivityRequestService_1.default(completeActivityRequestRepository, gamesRepository, transactionProvider);
        const fakeGame = new fakes_1.FakeGame();
        const game = await gamesRepository.create(fakeGame);
        await expect(deleteUnlockAchievementRequest.execute({
            gameId: game.id,
            requestId: 'invalid id',
        })).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
