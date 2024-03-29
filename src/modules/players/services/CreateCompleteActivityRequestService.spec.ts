import {
  FakeGamesRepository,
  FakeActivitiesRepository,
} from '@shared/domain/repositories/fakes';
import FakeCompleteActivityRequestRepository from '@modules/players/domain/repositories/fakes/FakeCompleteActivityRequestRepository';
import CreateCompleteActivityRequestService from './CreateCompleteActivityRequestService';

import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import { RequestError } from '@shared/infra/errors';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import { FakeCompleteActivityRequest } from '@modules/players/domain/entities/fakes';
import {
  FakeActivity,
  FakeGame,
  FakeUser,
} from '@shared/domain/entities/fakes';
import CreateActivityAdapter from '@shared/domain/adapters/CreateActivity';
import CreateGameAdapter from '@shared/domain/adapters/CreateGame';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';

const initService = async () => {
  const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
  const gamesRepository = new FakeGamesRepository();
  const activitiesRepository = new FakeActivitiesRepository();
  const playersRepository = new FakePlayersRepository();
  const transactionProvider = new FakeTransactionProvider();

  const createCompleteActivity = new CreateCompleteActivityRequestService(
    completeActivityRequestRepository,
    gamesRepository,
    activitiesRepository,
    playersRepository,
    transactionProvider,
  );

  const user = new FakeUser();

  const fakeGame = new FakeGame();
  const game = await gamesRepository.create(
    new CreateGameAdapter({
      name: fakeGame.name,
      description: fakeGame.description,
      creatorId: user.id,
    }),
  );

  const fakeActivity = new FakeActivity({ game: game.id });
  const activity = await activitiesRepository.create(
    new CreateActivityAdapter({
      gameId: game.id,
      name: fakeActivity.name,
      description: fakeActivity.description,
      experience: fakeActivity.experience,
    }),
  );

  const player = await playersRepository.create(
    new CreatePlayerAdapter({
      userId: user.id,
      gameId: game.id,
      gameRanks: game.ranks,
      gameLevels: game.levelInfo,
    }),
  );

  return {
    userId: user.id,
    createCompleteActivity,
    game,
    activity,
    player,
  };
};

describe('CreateCompleteActivityRequestService', () => {
  it('should create an complete activity request successfully', async () => {
    const {
      userId,
      createCompleteActivity,
      activity,
      game,
      player,
    } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest({
      requester: player.id,
      activity: activity.id,
      game: game.id,
    });

    const request = await createCompleteActivity.execute({
      userId,
      activity: fakeCompleteActivity.activity.id,
      gameId: fakeCompleteActivity.game,
      requester: fakeCompleteActivity.requester.id,
      completionDate: fakeCompleteActivity.completionDate,
      information: fakeCompleteActivity.information,
      requestDate: fakeCompleteActivity.requestDate,
    });

    expect(request).toHaveProperty('id');
    expect(request.game).toBe(fakeCompleteActivity.game);
    expect(request.activity.id).toBe(fakeCompleteActivity.activity.id);
    expect(request.requester.id).toBe(fakeCompleteActivity.requester.id);
  });

  it('should throw when trying to make a request to a non existing game', async () => {
    const {
      userId,
      createCompleteActivity,
      activity,
      player,
    } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest({
      requester: player.id,
      activity: activity.id,
      game: 'invalid game',
    });

    await expect(
      createCompleteActivity.execute({
        userId,
        activity: fakeCompleteActivity.activity.id,
        gameId: fakeCompleteActivity.game,
        requester: fakeCompleteActivity.requester.id,
        completionDate: fakeCompleteActivity.completionDate,
        information: fakeCompleteActivity.information,
        requestDate: fakeCompleteActivity.requestDate,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to request to a unknown activity', async () => {
    const {
      userId,
      createCompleteActivity,
      game,
      player,
    } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest({
      requester: player.id,
      activity: 'invalid activity',
      game: game.id,
    });

    await expect(
      createCompleteActivity.execute({
        userId,
        activity: fakeCompleteActivity.activity.id,
        gameId: fakeCompleteActivity.game,
        requester: fakeCompleteActivity.requester.id,
        completionDate: fakeCompleteActivity.completionDate,
        information: fakeCompleteActivity.information,
        requestDate: fakeCompleteActivity.requestDate,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when the requesting player does is invalid', async () => {
    const {
      userId,
      createCompleteActivity,
      activity,
      game,
    } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest({
      requester: 'invalid player',
      activity: activity.id,
      game: game.id,
    });

    await expect(
      createCompleteActivity.execute({
        userId,
        activity: fakeCompleteActivity.activity.id,
        gameId: fakeCompleteActivity.game,
        requester: fakeCompleteActivity.requester.id,
        completionDate: fakeCompleteActivity.completionDate,
        information: fakeCompleteActivity.information,
        requestDate: fakeCompleteActivity.requestDate,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
