import { v4 as uuid } from 'uuid';

import FakeActivitiesRepository from '@modules/games/domain/repositories/fakes/FakeActivitiesRepository';
import DeleteActivityService from './DeleteActivityService';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { FakeActivity } from '@shared/domain/entities/fakes';

describe('DeleteActivityService', () => {
  it('should delete the right achievement', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const deleteActivity = new DeleteActivityService(activitiesRepository);

    const gameId = uuid();
    const fakeActivity = new FakeActivity({ game: gameId });

    await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId,
        name: fakeActivity.name,
        description: fakeActivity.description,
        experience: fakeActivity.experience,
      }),
    );
    const activityToBeDeleted = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId,
        name: fakeActivity.name,
        description: fakeActivity.description,
        experience: fakeActivity.experience,
      }),
    );
    await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId,
        name: fakeActivity.name,
        description: fakeActivity.description,
        experience: fakeActivity.experience,
      }),
    );

    await deleteActivity.execute({
      gameId,
      activityId: activityToBeDeleted.id,
    });

    const activities = await activitiesRepository.findAllFromGame(gameId);

    expect(activities).toHaveLength(2);
    expect(activities).not.toContainEqual(activityToBeDeleted);
  });
});
