import { RequestError } from '@shared/infra/errors';

import { FakeAchievementsRepository } from '@shared/domain/repositories/fakes';
import UpdateAchievementService from './UpdateAchievementService';
import { FakeAchievement, FakeGame } from '@shared/domain/entities/fakes';

describe('UpdateAchievementService', () => {
  it('should update the achievement correctly', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const updateAchievement = new UpdateAchievementService(
      achievementsRepository,
    );

    const game = new FakeGame();
    const fakeAchievement = new FakeAchievement({ game: game.id });

    const achievement = await achievementsRepository.create({
      gameId: game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      title: fakeAchievement.title?.id,
    });

    const updatedAchievement = await updateAchievement.execute({
      gameId: game.id,
      id: achievement.id,
      name: 'New name',
      description: 'New description',
    });

    expect(updatedAchievement).not.toEqual(achievement);
  });

  it('should throw when trying to update a non existing achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const updateAchievement = new UpdateAchievementService(
      achievementsRepository,
    );

    const game = new FakeGame();
    const fakeAchievement = new FakeAchievement({ game: game.id });

    await expect(
      updateAchievement.execute({
        gameId: game.id,
        ...fakeAchievement,
        id: 'invalid id',
        title: fakeAchievement.title?.id,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
