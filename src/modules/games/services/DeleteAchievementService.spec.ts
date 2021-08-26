import DeleteAchievementService from './DeleteAchievementService';
import { FakeAchievement, FakeGame } from '@shared/domain/entities/fakes';
import { FakeAchievementsRepository } from '@shared/domain/repositories/fakes';

describe('DeleteAchievementService', () => {
  it('should delete the right achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const deleteAchievement = new DeleteAchievementService(
      achievementsRepository,
    );

    const game = new FakeGame();
    const fakeAchievement = new FakeAchievement({ game: game.id });

    await achievementsRepository.create({
      gameId: game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    const achievementToBeDeleted = await achievementsRepository.create({
      gameId: game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    await achievementsRepository.create({
      gameId: game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });

    await deleteAchievement.execute({
      gameId: game.id,
      id: achievementToBeDeleted.id,
    });

    const achievements = await achievementsRepository.findAllFromGame(game.id);

    expect(achievements).toHaveLength(2);
    expect(achievements).not.toContainEqual(achievementToBeDeleted);
  });
});
