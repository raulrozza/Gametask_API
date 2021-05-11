import { v4 as uuid } from 'uuid';
import FakeGame from '../fakes/FakeGame';

import FakeGamesRepository from '../repositories/fakes/FakeGamesRepository';
import ListGamesService from './ListGamesService';
import { IGame } from '../entities';

describe('ListGamesService', () => {
  it('should list only the user owned games', async () => {
    const gamesRepository = new FakeGamesRepository();

    const listGames = new ListGamesService(gamesRepository);

    const userId = uuid();

    const fakeGame = new FakeGame();

    await gamesRepository.create({
      administrators: [userId],
      name: fakeGame.name,
      description: fakeGame.description,
    } as IGame);
    await gamesRepository.create({
      administrators: [userId],
      name: fakeGame.name,
      description: fakeGame.description,
    } as IGame);
    await gamesRepository.create({
      administrators: ['not-my-game-id'],
      name: fakeGame.name,
      description: fakeGame.description,
    } as IGame);

    const games = await listGames.execute(userId);

    expect(games).toHaveLength(2);
  });
});
