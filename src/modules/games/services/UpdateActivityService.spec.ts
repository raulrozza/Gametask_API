import { RequestError } from '@shared/infra/errors';
import { v4 as uuid } from 'uuid';

import FakeActivity from '../fakes/FakeActivity';
import FakeActivitiesRepository from '../repositories/fakes/FakeActivitiesRepository';
import UpdateActivityService from './UpdateActivityService';

describe('UpdateActivityService', () => {
  it('should update the activity correctly, both the times', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const updateActivity = new UpdateActivityService(activitiesRepository);

    const gameId = uuid();
    const userId = uuid();
    const fakeActivity = new FakeActivity(gameId);

    const activity = await activitiesRepository.create(fakeActivity);

    const updatedActivity = await updateActivity.execute({
      gameId,
      userId,
      id: activity.id,
      name: 'New name',
      description: 'New description',
      experience: fakeActivity.experience,
    });

    expect(updatedActivity).not.toEqual(activity);
    expect(updatedActivity.changelog).toHaveLength(1);

    const activityLog = updatedActivity.changelog[0];

    expect(activityLog.userId).toBe(userId);
    expect(activityLog.changes).toHaveProperty('name');
    expect(activityLog.changes).toHaveProperty('description');
    expect(activityLog.changes).not.toHaveProperty('experience');

    const newlyUpdatedActivity = await updateActivity.execute({
      gameId,
      userId,
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

    const gameId = uuid();
    const userId = uuid();
    const fakeActivity = new FakeActivity(gameId);

    await expect(
      updateActivity.execute({
        gameId,
        userId,
        ...fakeActivity,
        id: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
