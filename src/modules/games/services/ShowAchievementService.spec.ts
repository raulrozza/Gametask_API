import { FakeAchievementsRepository } from '@shared/domain/repositories/fakes';
import ShowAchievementService from './ShowAchievementService';
import { FakeAchievement, FakeGame } from '@shared/domain/entities/fakes';

describe('ShowAchievementService', () => {
  it('should return the correct achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const showAchievement = new ShowAchievementService(achievementsRepository);

    const game = new FakeGame();
    const fakeAchievement = new FakeAchievement({ game: game.id });
    const achievement = await achievementsRepository.create({
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      gameId: game.id,
    });

    const fetchedAchievement = await showAchievement.execute({
      achievementId: achievement.id,
      gameId: game.id,
    });

    expect(fetchedAchievement).toEqual(achievement);
  });

  it('should return undefined when trying to fetch an achievement while providing a wrong id', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const showAchievement = new ShowAchievementService(achievementsRepository);

    const game = new FakeGame();
    const fakeAchievement = new FakeAchievement({ game: game.id });
    const achievement = await achievementsRepository.create({
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      gameId: 'random-game-id',
    });

    const fetchedAchievement = await showAchievement.execute({
      achievementId: achievement.id,
      gameId: game.id,
    });

    expect(fetchedAchievement).toBeUndefined();
  });
});
