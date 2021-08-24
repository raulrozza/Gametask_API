import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import DeleteAchievementService from './DeleteAchievementService';
import { FakeAchievement } from '@shared/domain/entities/fakes';

describe('DeleteAchievementService', () => {
  it('should delete the right achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const deleteAchievement = new DeleteAchievementService(
      achievementsRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement({ game: gameId });

    await achievementsRepository.create({
      gameId: fakeAchievement.game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    const achievementToBeDeleted = await achievementsRepository.create({
      gameId: fakeAchievement.game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    await achievementsRepository.create({
      gameId: fakeAchievement.game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });

    await deleteAchievement.execute({ gameId, id: achievementToBeDeleted.id });

    const achievements = await achievementsRepository.findAllFromGame(gameId);

    expect(achievements).toHaveLength(2);
    expect(achievements).not.toContainEqual(achievementToBeDeleted);
  });
});
