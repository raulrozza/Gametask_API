import { RequestError } from '@shared/errors/implementations';
import { v4 as uuid } from 'uuid';
import { ITitle } from '../entities';
import { FakeTitle } from '../fakes';
import FakeAchievement from '../fakes/FakeAchievement';
import FakeAchievementsRepository from '../repositories/fakes/FakeAchievementsRepository';
import FakeTitlesRepository from '../repositories/fakes/FakeTitlesRepository';
import CreateAchievementService from './CreateAchievementService';

describe('CreateAchievementService', () => {
  it('should create the achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const titlesRepository = new FakeTitlesRepository();
    const createAchievement = new CreateAchievementService(
      achievementsRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);
    const fakeTitle = new FakeTitle(gameId);

    const title = await titlesRepository.create({
      name: fakeTitle.name,
      game: fakeTitle.game,
    } as ITitle);

    const payload = {
      gameId,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      title: title.id,
    };

    const achievement = await createAchievement.execute(payload);

    expect(achievement).toHaveProperty('id');
    expect(achievement.name).toBe(fakeAchievement.name);
    expect(achievement.description).toBe(fakeAchievement.description);
  });

  it('should throw when creating the achievement with an unexisting title', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const titlesRepository = new FakeTitlesRepository();
    const createAchievement = new CreateAchievementService(
      achievementsRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);

    const payload = {
      gameId,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      title: 'fake title',
    };

    await expect(createAchievement.execute(payload)).rejects.toBeInstanceOf(
      RequestError,
    );
  });
});
