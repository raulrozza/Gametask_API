import { RequestError } from '@shared/infra/errors';

import { FakeActivitiesRepository } from '@shared/domain/repositories/fakes';
import UpdateActivityService from './UpdateActivityService';
import {
  FakeActivity,
  FakeGame,
  FakeUser,
} from '@shared/domain/entities/fakes';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';

describe('UpdateActivityService', () => {
  it('should update the activity correctly, both the times', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const updateActivity = new UpdateActivityService(activitiesRepository);

    const game = new FakeGame();
    const user = new FakeUser();
    const fakeActivity = new FakeActivity({ game: game.id });

    const activity = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId: game.id,
        experience: fakeActivity.experience,
        name: fakeActivity.name,
        description: fakeActivity.description,
        dmRules: fakeActivity.dmRules,
      }),
    );

    const updatedActivity = await updateActivity.execute({
      gameId: game.id,
      userId: user.id,
      id: activity.id,
      name: 'New name',
      description: 'New description',
      experience: fakeActivity.experience,
    });

    expect(updatedActivity).not.toEqual(activity);
    expect(updatedActivity.changelog).toHaveLength(1);

    const activityLog = updatedActivity.changelog[0];

    expect(activityLog.user.id).toBe(user.id);
    expect(activityLog.changes).toHaveProperty('name');
    expect(activityLog.changes).toHaveProperty('description');
    expect(activityLog.changes).not.toHaveProperty('experience');

    const newlyUpdatedActivity = await updateActivity.execute({
      gameId: game.id,
      userId: user.id,
      id: activity.id,
      name: updatedActivity.name,
      description: updatedActivity.description,
      experience: 10,
    });

    expect(newlyUpdatedActivity).not.toEqual(updatedActivity);
    expect(newlyUpdatedActivity.changelog).toHaveLength(2);
  });

  it('should throw when trying to update a non existing activity', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const updateActivity = new UpdateActivityService(activitiesRepository);

    const game = new FakeGame();
    const user = new FakeUser();
    const fakeActivity = new FakeActivity({ game: game.id });

    await expect(
      updateActivity.execute({
        gameId: game.id,
        userId: user.id,
        ...fakeActivity,
        id: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
