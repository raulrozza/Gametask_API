import { v4 as uuid } from 'uuid';

import { IActivity } from '@modules/games/domain/entities';
import FakeActivity from '../fakes/FakeActivity';
import FakeActivitiesRepository from '@modules/games/domain/repositories/fakes/FakeActivitiesRepository';
import ShowActivityService from './ShowActivityService';

describe('ShowActivityService', () => {
  it('should return the correct activity', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const showActivity = new ShowActivityService(activitiesRepository);

    const gameId = uuid();
    const fakeActivity = new FakeActivity(gameId);

    const activity = await activitiesRepository.create({
      name: fakeActivity.name,
      description: fakeActivity.description,
      game: fakeActivity.game,
    } as IActivity);

    const fetchedActivity = await showActivity.execute({
      activityId: activity.id,
      gameId,
    });

    expect(fetchedActivity).toEqual(activity);
  });

  it('should return undefined when trying to fetch an activity while providing a wrong id', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const showActivity = new ShowActivityService(activitiesRepository);

    const gameId = uuid();
    const fakeActivity = new FakeActivity(gameId);

    const activity = await activitiesRepository.create({
      name: fakeActivity.name,
      description: fakeActivity.description,
      game: 'random-game-id',
    } as IActivity);

    const fetchedActivity = await showActivity.execute({
      activityId: activity.id,
      gameId,
    });

    expect(fetchedActivity).toBeUndefined();
  });
});
