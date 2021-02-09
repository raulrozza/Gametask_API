import { v4 as uuid } from 'uuid';

import { FakeAchievement } from '../fakes';
import { IAchievement } from '../entities';
import FakeAchievementsRepository from '../repositories/fakes/FakeAchievementsRepository';
import DeleteAchievementService from './DeleteAchievementService';

describe('DeleteAchievementService', () => {
  it('should delete the right achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const deleteTitle = new DeleteAchievementService(achievementsRepository);

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);

    await achievementsRepository.create({
      game: fakeAchievement.game,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    } as IAchievement);
    const achievementToBeDeleted = await achievementsRepository.create({
      game: fakeAchievement.game,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    } as IAchievement);
    await achievementsRepository.create({
      game: fakeAchievement.game,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    } as IAchievement);

    await deleteTitle.execute({ gameId, id: achievementToBeDeleted.id });

    const achievements = await achievementsRepository.findAllFromGame(gameId);

    expect(achievements).toHaveLength(2);
    expect(achievements).not.toContainEqual(achievementToBeDeleted);
  });
});
