import { v4 as uuid } from 'uuid';

import FakeActivity from '../fakes/FakeActivity';
import FakeActivitiesRepository from '../repositories/fakes/FakeActivitiesRepository';
import CreateActivityService from './CreateActivityService';

describe('CreateActivityService', () => {
  it('should create the activity', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const createActivity = new CreateActivityService(activitiesRepository);

    const gameId = uuid();
    const fakeActivity = new FakeActivity(gameId);

    const payload = {
      gameId,
      name: fakeActivity.name,
      description: fakeActivity.description,
      experience: fakeActivity.experience,
      dmRules: fakeActivity.dmRules,
    };

    const activity = await createActivity.execute(payload);

    expect(activity).toHaveProperty('id');
    expect(activity.name).toBe(fakeActivity.name);
    expect(activity.description).toBe(fakeActivity.description);
    expect(activity.experience).toBe(fakeActivity.experience);
    expect(activity.dmRules).toBe(fakeActivity.dmRules);
  });
});
