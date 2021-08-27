import { FakeAchievementsRepository } from '@shared/domain/repositories/fakes';
import ListAchievementsService from './ListAchievementsService';
import { FakeAchievement, FakeGame } from '@shared/domain/entities/fakes';

describe('ListAchievementsService', () => {
  it('should list only the achievements of the selected game', async () => {
    const achievementsRepository = new FakeAchievementsRepository();

    const listAchievements = new ListAchievementsService(
      achievementsRepository,
    );

    const game = new FakeGame();

    const fakeAchievement = new FakeAchievement({ game: game.id });

    await achievementsRepository.create({
      gameId: game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    await achievementsRepository.create({
      gameId: game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    await achievementsRepository.create({
      gameId: 'another_game_id',
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });

    const achievements = await listAchievements.execute(game.id);

    expect(achievements).toHaveLength(2);
  });
});
