import { FakeActivitiesRepository } from '@shared/domain/repositories/fakes';
import ShowActivityService from './ShowActivityService';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { FakeActivity, FakeGame } from '@shared/domain/entities/fakes';

describe('ShowActivityService', () => {
  it('should return the correct activity', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const showActivity = new ShowActivityService(activitiesRepository);

    const game = new FakeGame();
    const fakeActivity = new FakeActivity({ game: game.id });

    const activity = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId: game.id,
        name: fakeActivity.name,
        description: fakeActivity.description,
        experience: fakeActivity.experience,
      }),
    );

    const fetchedActivity = await showActivity.execute({
      activityId: activity.id,
      gameId: game.id,
    });

    expect(fetchedActivity).toEqual(activity);
  });

  it('should return undefined when trying to fetch an activity while providing a wrong id', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const showActivity = new ShowActivityService(activitiesRepository);

    const game = new FakeGame();
    const fakeActivity = new FakeActivity({ game: game.id });

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
      gameId: game.id,
    });

    expect(fetchedActivity).toBeUndefined();
  });
});
