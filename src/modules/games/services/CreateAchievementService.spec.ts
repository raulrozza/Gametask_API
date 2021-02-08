import { v4 as uuid } from 'uuid';
import FakeAchievement from '../fakes/FakeAchievement';
import FakeAchievementsRepository from '../repositories/fakes/FakeAchievementsRepository';
import CreateAchievementService from './CreateAchievementService';

describe('CreateAchievementService', () => {
  it('should create the game', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const createAchievement = new CreateAchievementService(
      achievementsRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);

    const payload = {
      gameId,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    };

    const game = await createAchievement.execute(payload);

    expect(game).toHaveProperty('id');
    expect(game.name).toBe(fakeAchievement.name);
    expect(game.description).toBe(fakeAchievement.description);
  });
});
