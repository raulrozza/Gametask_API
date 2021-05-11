import { v4 as uuid } from 'uuid';
import FakeActivity from '../fakes/FakeActivity';

import FakeActivitiesRepository from '../repositories/fakes/FakeActivitiesRepository';
import ListActivitiesService from './ListActivitiesService';
import { IActivity } from '../entities';

describe('ListActivitiesService', () => {
  it('should list only the activites of the selected game', async () => {
    const activitiesRepository = new FakeActivitiesRepository();

    const listActivities = new ListActivitiesService(activitiesRepository);

    const gameId = uuid();

    const activity = new FakeActivity(gameId);

    await activitiesRepository.create({
      game: activity.game,
      name: activity.name,
      description: activity.description,
    } as IActivity);
    await activitiesRepository.create({
      game: activity.game,
      name: activity.name,
      description: activity.description,
    } as IActivity);
    await activitiesRepository.create({
      game: 'another_game_id',
      name: activity.name,
      description: activity.description,
    } as IActivity);

    const activities = await listActivities.execute(gameId);

    expect(activities).toHaveLength(2);
  });
});
