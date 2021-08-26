import { v4 as uuid } from 'uuid';

import { FakeActivitiesRepository } from '@shared/domain/repositories/fakes';
import ListActivitiesService from './ListActivitiesService';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { FakeActivity } from '@shared/domain/entities/fakes';

describe('ListActivitiesService', () => {
  it('should list only the activites of the selected game', async () => {
    const activitiesRepository = new FakeActivitiesRepository();

    const listActivities = new ListActivitiesService(activitiesRepository);

    const gameId = uuid();

    const activity = new FakeActivity({ game: gameId });

    await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId,
        name: activity.name,
        description: activity.description,
        experience: activity.experience,
      }),
    );
    await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId,
        name: activity.name,
        description: activity.description,
        experience: activity.experience,
      }),
    );
    await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId: 'another_game_id',
        name: activity.name,
        description: activity.description,
        experience: activity.experience,
      }),
    );

    const activities = await listActivities.execute(gameId);

    expect(activities).toHaveLength(2);
  });
});
