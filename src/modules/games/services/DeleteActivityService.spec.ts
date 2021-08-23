import { v4 as uuid } from 'uuid';

import { FakeActivity } from '../fakes';
import { IActivity } from '@modules/games/domain/entities';
import FakeActivitiesRepository from '@modules/games/domain/repositories/fakes/FakeActivitiesRepository';
import DeleteActivityService from './DeleteActivityService';

describe('DeleteActivityService', () => {
  it('should delete the right achievement', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const deleteActivity = new DeleteActivityService(activitiesRepository);

    const gameId = uuid();
    const fakeActivity = new FakeActivity(gameId);

    await activitiesRepository.create({
      game: fakeActivity.game,
      name: fakeActivity.name,
      description: fakeActivity.description,
      experience: fakeActivity.experience,
    } as IActivity);
    const activityToBeDeleted = await activitiesRepository.create({
      game: fakeActivity.game,
      name: fakeActivity.name,
      description: fakeActivity.description,
      experience: fakeActivity.experience,
    } as IActivity);
    await activitiesRepository.create({
      game: fakeActivity.game,
      name: fakeActivity.name,
      description: fakeActivity.description,
      experience: fakeActivity.experience,
    } as IActivity);

    await deleteActivity.execute({
      gameId,
      activityId: activityToBeDeleted.id,
    });

    const activities = await activitiesRepository.findAllFromGame(gameId);

    expect(activities).toHaveLength(2);
    expect(activities).not.toContainEqual(activityToBeDeleted);
  });
});
