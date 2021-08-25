import { v4 as uuid } from 'uuid';

import FakeActivitiesRepository from '@modules/games/domain/repositories/fakes/FakeActivitiesRepository';
import ShowActivityService from './ShowActivityService';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { FakeActivity } from '@shared/domain/entities/fakes';

describe('ShowActivityService', () => {
  it('should return the correct activity', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const showActivity = new ShowActivityService(activitiesRepository);

    const gameId = uuid();
    const fakeActivity = new FakeActivity({ game: gameId });

    const activity = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId,
        name: fakeActivity.name,
        description: fakeActivity.description,
        experience: fakeActivity.experience,
      }),
    );

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
    const fakeActivity = new FakeActivity({ game: gameId });

    const activity = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId: 'random=game-id',
        name: fakeActivity.name,
        description: fakeActivity.description,
        experience: fakeActivity.experience,
      }),
    );

    const fetchedActivity = await showActivity.execute({
      activityId: activity.id,
      gameId,
    });

    expect(fetchedActivity).toBeUndefined();
  });
});
