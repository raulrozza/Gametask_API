import { RequestError } from '@shared/infra/errors';
import { v4 as uuid } from 'uuid';

import FakeAchievement from '../fakes/FakeAchievement';
import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import UpdateAchievementService from './UpdateAchievementService';

describe('UpdateAchievementService', () => {
  it('should update the achievement correctly', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const updateAchievement = new UpdateAchievementService(
      achievementsRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);

    const achievement = await achievementsRepository.create(fakeAchievement);

    const updatedAchievement = await updateAchievement.execute({
      gameId,
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

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);

    await expect(
      updateAchievement.execute({
        gameId,
        ...fakeAchievement,
        id: 'invalid id',
        title: fakeAchievement.title as string | undefined,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
