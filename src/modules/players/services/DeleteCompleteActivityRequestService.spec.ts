import { v4 as uuid } from 'uuid';

import { FakeGamesRepository } from '@shared/domain/repositories/fakes';
import FakeCompleteActivityRequestRepository from '@modules/players/domain/repositories/fakes/FakeCompleteActivityRequestRepository';
import DeleteCompleteActivityRequestService from './DeleteCompleteActivityRequestService';
import { RequestError } from '@shared/infra/errors';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import {
  FakeActivity,
  FakeGame,
  FakeUser,
} from '@shared/domain/entities/fakes';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { FakeCompleteActivityRequest } from '@modules/players/domain/entities/fakes';
import CreateCompleteActivityRequestAdapter from '@modules/players/domain/adapters/CreateCompleteActivityRequest';

describe('DeleteCompleteActivityRequest', () => {
  it('should successfully delete the request', async () => {
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
    const gamesRepository = new FakeGamesRepository();
    const transactionProvider = new FakeTransactionProvider();
    const deleteUnlockActivityRequest = new DeleteCompleteActivityRequestService(
      completeActivityRequestRepository,
      gamesRepository,
      transactionProvider,
    );

    const fakeGame = new FakeGame();
    const game = await gamesRepository.create(
      new CreateGameAdapter({
        creatorId: uuid(),
        name: fakeGame.name,
        description: fakeGame.description,
      }),
    );

    const requester = new FakeUser();
    const activity = new FakeActivity();

    const fakeActivityRequest = new FakeCompleteActivityRequest({
      requester: requester.id,
      activity: activity.id,
      game: game.id,
    });
    const request = await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeActivityRequest,
        requester: requester.id,
        activity: activity.id,
      }),
    );

    await deleteUnlockActivityRequest.execute({
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

    const fakeRequest = new FakeCompleteActivityRequest();
    const request = await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeRequest,
        requester: fakeRequest.requester.id,
        activity: fakeRequest.activity.id,
      }),
    );

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
    const game = await gamesRepository.create(
      new CreateGameAdapter({
        creatorId: uuid(),
        name: fakeGame.name,
        description: fakeGame.description,
      }),
    );

    await expect(
      deleteUnlockAchievementRequest.execute({
        gameId: game.id,
        requestId: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
