import { v4 as uuid } from 'uuid';

import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import DeleteUnlockAchievementRequestService from './DeleteUnlockAchievementRequestService';
import FakeUnlockAchievementRequest from '../fakes/FakeUnlockAchievementRequest';
import { RequestError } from '@shared/infra/errors';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import { FakeGame } from '@shared/domain/entities/fakes';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';

describe('DeleteUnlockAchievementRequestService', () => {
  it('should successfully delete the request', async () => {
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
    const gamesRepository = new FakeGamesRepository();
    const transactionProvider = new FakeTransactionProvider();
    const deleteUnlockAchievementRequest = new DeleteUnlockAchievementRequestService(
      unlockAchievementRequestRepository,
      gamesRepository,
      transactionProvider,
    );

    const fakeGame = new FakeGame();
    const createGame = new CreateGameAdapter({
      creatorId: uuid(),
      name: fakeGame.name,
      description: fakeGame.description,
    });
    const game = await gamesRepository.create(createGame);

    const requesterId = uuid();
    const achievementId = uuid();

    const fakeAchievementRequest = new FakeUnlockAchievementRequest(
      game.id,
      requesterId,
      achievementId,
    );
    const request = await unlockAchievementRequestRepository.create(
      fakeAchievementRequest,
    );

    await deleteUnlockAchievementRequest.execute({
      gameId: game.id,
      requestId: request.id,
    });

    const requestsList = await unlockAchievementRequestRepository.findAllFromGame(
      game.id,
    );

    expect(requestsList).toHaveLength(0);
  });

  it('should throw when trying to delete a non existing game', async () => {
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
    const gamesRepository = new FakeGamesRepository();
    const transactionProvider = new FakeTransactionProvider();
    const deleteUnlockAchievementRequest = new DeleteUnlockAchievementRequestService(
      unlockAchievementRequestRepository,
      gamesRepository,
      transactionProvider,
    );

    const id = uuid();
    const fakeRequest = new FakeUnlockAchievementRequest(id, id, id);
    const request = await unlockAchievementRequestRepository.create(
      fakeRequest,
    );

    await expect(
      deleteUnlockAchievementRequest.execute({
        gameId: 'invalid-id',
        requestId: request.id,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to delete a non existing request', async () => {
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
    const gamesRepository = new FakeGamesRepository();
    const transactionProvider = new FakeTransactionProvider();
    const deleteUnlockAchievementRequest = new DeleteUnlockAchievementRequestService(
      unlockAchievementRequestRepository,
      gamesRepository,
      transactionProvider,
    );

    const fakeGame = new FakeGame();
    const createGame = new CreateGameAdapter({
      creatorId: uuid(),
      name: fakeGame.name,
      description: fakeGame.description,
    });
    const game = await gamesRepository.create(createGame);

    await expect(
      deleteUnlockAchievementRequest.execute({
        gameId: game.id,
        requestId: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
