import { v4 as uuid } from 'uuid';
import FakeAchievement from '../fakes/FakeAchievement';

import FakeAchievementsRepository from '../repositories/fakes/FakeAchievementsRepository';
import ListAchievementsService from './ListAchievementsService';
import { IAchievement } from '../entities';

describe('ListAchievementsService', () => {
  it('should list only the achievements of the selected game', async () => {
    const achievementsRepository = new FakeAchievementsRepository();

    const listAchievements = new ListAchievementsService(
      achievementsRepository,
    );

    const gameId = uuid();

    const fakeAchievement = new FakeAchievement(gameId);

    await achievementsRepository.create({
      game: fakeAchievement.game,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    } as IAchievement);
    await achievementsRepository.create({
      game: fakeAchievement.game,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    } as IAchievement);
    await achievementsRepository.create({
      game: 'another_game_id',
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    } as IAchievement);

    const games = await listAchievements.execute(gameId);

    expect(games).toHaveLength(2);
  });
});
