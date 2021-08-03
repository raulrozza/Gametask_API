import { v4 as uuid } from 'uuid';

import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import FakeCompleteActivityRequestRepository from '../repositories/fakes/FakeCompleteActivityRequestRepository';
import DeleteCompleteActivityRequestService from './DeleteCompleteActivityRequestService';
import FakeCompleteActivityRequest from '../fakes/FakeCompleteActivityRequest';
import { RequestError } from '@shared/infra/errors';
import { FakeGame } from '@modules/games/fakes';
import FakeTransactionProvider from '@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider';

describe('DeleteCompleteActivityRequest', () => {
  it('should successfully delete the request', async () => {
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
    const gamesRepository = new FakeGamesRepository();
    const transactionProvider = new FakeTransactionProvider();
    const deleteUnlockAchievementRequest = new DeleteCompleteActivityRequestService(
      completeActivityRequestRepository,
      gamesRepository,
      transactionProvider,
    );

    const fakeGame = new FakeGame();
    const game = await gamesRepository.create(fakeGame);

    const requesterId = uuid();
    const achievementId = uuid();

    const fakeActivityRequest = new FakeCompleteActivityRequest(
      game.id,
      requesterId,
      achievementId,
    );
    const request = await completeActivityRequestRepository.create(
      fakeActivityRequest,
    );

    await deleteUnlockAchievementRequest.execute({
      gameId: game.id,
      requestId: request.id,
    });

    const requestsList = await completeActivityRequestRepository.findAllFromGame(
      game.id,
    );

    expect(requestsList).toHaveLength(0);
  });

  it('should throw when trying to delete a non existing game', async () => {
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
    const gamesRepository = new FakeGamesRepository();
    const transactionProvider = new FakeTransactionProvider();
    const deleteUnlockAchievementRequest = new DeleteCompleteActivityRequestService(
      completeActivityRequestRepository,
      gamesRepository,
      transactionProvider,
    );

    const id = uuid();
    const fakeRequest = new FakeCompleteActivityRequest(id, id, id);
    const request = await completeActivityRequestRepository.create(fakeRequest);

    await expect(
      deleteUnlockAchievementRequest.execute({
        gameId: 'invalid-id',
        requestId: request.id,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to delete a non existing request', async () => {
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
    const gamesRepository = new FakeGamesRepository();
    const transactionProvider = new FakeTransactionProvider();
    const deleteUnlockAchievementRequest = new DeleteCompleteActivityRequestService(
      completeActivityRequestRepository,
      gamesRepository,
      transactionProvider,
    );

    const fakeGame = new FakeGame();
    const game = await gamesRepository.create(fakeGame);

    await expect(
      deleteUnlockAchievementRequest.execute({
        gameId: game.id,
        requestId: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
