import { v4 as uuid } from 'uuid';

import { IAchievement } from '../entities';
import FakeAchievement from '../fakes/FakeAchievement';
import FakeAchievementsRepository from '../repositories/fakes/FakeAchievementsRepository';
import ShowAchievementService from './ShowAchievementService';

describe('ShowAchievementService', () => {
  it('should return the correct achievement', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const showGames = new ShowAchievementService(achievementsRepository);

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);
    const achievement = await achievementsRepository.create({
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      game: fakeAchievement.game,
    } as IAchievement);

    const fetchedAchievement = await showGames.execute({
      achievementId: achievement.id,
      gameId,
    });

    expect(fetchedAchievement).toEqual(achievement);
  });

  it('should return undefined when trying to fetch an achievement while providing a wrong id', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const showGames = new ShowAchievementService(achievementsRepository);

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);
    const achievement = await achievementsRepository.create({
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      game: 'random-game-id',
    } as IAchievement);

    const fetchedAchievement = await showGames.execute({
      achievementId: achievement.id,
      gameId,
    });

    expect(fetchedAchievement).toBeUndefined();
  });
});
