import { FakeActivitiesRepository } from '@shared/domain/repositories/fakes';
import CreateActivityService from './CreateActivityService';
import { FakeActivity, FakeGame } from '@shared/domain/entities/fakes';

describe('CreateActivityService', () => {
  it('should create the activity', async () => {
    const activitiesRepository = new FakeActivitiesRepository();
    const createActivity = new CreateActivityService(activitiesRepository);

    const game = new FakeGame();
    const fakeActivity = new FakeActivity({ game: game.id });

    const payload = {
      gameId: game.id,
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
