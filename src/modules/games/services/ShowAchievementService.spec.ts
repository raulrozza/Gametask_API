import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import ShowAchievementService from './ShowAchievementService';
import { FakeAchievement } from '@shared/domain/entities/fakes';

describe('ShowAchievementService', () => {
  it('should return the correct achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const showAchievement = new ShowAchievementService(achievementsRepository);

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement({ game: gameId });
    const achievement = await achievementsRepository.create({
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      gameId: fakeAchievement.game.id,
    });

    const fetchedAchievement = await showAchievement.execute({
      achievementId: achievement.id,
      gameId,
    });

    expect(fetchedAchievement).toEqual(achievement);
  });

  it('should return undefined when trying to fetch an achievement while providing a wrong id', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const showAchievement = new ShowAchievementService(achievementsRepository);

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement({ game: gameId });
    const achievement = await achievementsRepository.create({
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      gameId: 'random-game-id',
    });

    const fetchedAchievement = await showAchievement.execute({
      achievementId: achievement.id,
      gameId,
    });

    expect(fetchedAchievement).toBeUndefined();
  });
});
