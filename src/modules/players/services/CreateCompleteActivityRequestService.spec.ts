import { v4 as uuid } from 'uuid';

import { IActivity, IGame } from '@modules/games/entities';
import { FakeActivity, FakeGame } from '@modules/games/fakes';
import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import FakeCompleteActivityRequestRepository from '../repositories/fakes/FakeCompleteActivityRequestRepository';
import CreateCompleteActivityRequestService from './CreateCompleteActivityRequestService';
import FakeActivitiesRepository from '@modules/games/repositories/fakes/FakeActivitiesRepository';
import FakeCompleteActivityRequest from '../fakes/FakeCompleteActivityRequest';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import FakePlayer from '../fakes/FakePlayer';
import { IPlayer } from '../entities';
import { RequestError } from '@shared/errors/implementations';

const initService = async () => {
  const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
  const gamesRepository = new FakeGamesRepository();
  const activitiesRepository = new FakeActivitiesRepository();
  const playersRepository = new FakePlayersRepository();

  const createCompleteActivity = new CreateCompleteActivityRequestService(
    completeActivityRequestRepository,
    gamesRepository,
  );

  const userId = uuid();

  const { id: _, ...fakeGame } = new FakeGame();
  const game = await gamesRepository.create(fakeGame as IGame);

  const { id: __, ...fakeActivity } = new FakeActivity(game.id);
  const activity = await activitiesRepository.create(fakeActivity as IActivity);

  const { id: ___, ...fakePlayer } = new FakePlayer(userId, game.id);
  const player = await playersRepository.create(fakePlayer as IPlayer);

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
    const {
      createCompleteActivity,
      activity,
      game,
      player,
    } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest(
      player.id,
      activity.id,
      game.id,
    );

    const request = await createCompleteActivity.execute({
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
    const { createCompleteActivity, activity, player } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest(
      player.id,
      activity.id,
      'invalid game',
    );

    await expect(
      createCompleteActivity.execute({
        activity: fakeCompleteActivity.activity,
        gameId: fakeCompleteActivity.game,
        requester: fakeCompleteActivity.requester,
        completionDate: fakeCompleteActivity.completionDate,
        information: fakeCompleteActivity.information,
        requestDate: fakeCompleteActivity.requestDate,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to request to a unknown activity', async () => {
    const { createCompleteActivity, game, player } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest(
      player.id,
      'invalid activity',
      game.id,
    );

    await expect(
      createCompleteActivity.execute({
        activity: fakeCompleteActivity.activity,
        gameId: fakeCompleteActivity.game,
        requester: fakeCompleteActivity.requester,
        completionDate: fakeCompleteActivity.completionDate,
        information: fakeCompleteActivity.information,
        requestDate: fakeCompleteActivity.requestDate,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when the requesting player does is invalid', async () => {
    const { createCompleteActivity, activity, game } = await initService();

    const fakeCompleteActivity = new FakeCompleteActivityRequest(
      'invalid player',
      activity.id,
      game.id,
    );

    await expect(
      createCompleteActivity.execute({
        activity: fakeCompleteActivity.activity,
        gameId: fakeCompleteActivity.game,
        requester: fakeCompleteActivity.requester,
        completionDate: fakeCompleteActivity.completionDate,
        information: fakeCompleteActivity.information,
        requestDate: fakeCompleteActivity.requestDate,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
