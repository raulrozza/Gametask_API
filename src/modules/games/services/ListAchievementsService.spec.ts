import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import ListAchievementsService from './ListAchievementsService';
import { FakeAchievement } from '@shared/domain/entities/fakes';

describe('ListAchievementsService', () => {
  it('should list only the achievements of the selected game', async () => {
    const achievementsRepository = new FakeAchievementsRepository();

    const listAchievements = new ListAchievementsService(
      achievementsRepository,
    );

    const gameId = uuid();

    const fakeAchievement = new FakeAchievement({ game: gameId });

    await achievementsRepository.create({
      gameId: fakeAchievement.game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    await achievementsRepository.create({
      gameId: fakeAchievement.game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });
    await achievementsRepository.create({
      gameId: 'another_game_id',
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    });

    const achievements = await listAchievements.execute(gameId);

    expect(achievements).toHaveLength(2);
  });
});
