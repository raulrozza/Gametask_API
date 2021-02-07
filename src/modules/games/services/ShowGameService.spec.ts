import { v4 as uuid } from 'uuid';

import { IGame } from '../entities';
import FakeGame from '../fakes/FakeGame';
import FakeGamesRepository from '../repositories/fakes/FakeGamesRepository';
import ShowGameService from './ShowGameService';

describe('ShowGameService', () => {
  it('should return the correct game', async () => {
    const gamesRepository = new FakeGamesRepository();
    const showGames = new ShowGameService(gamesRepository);
    const userId = uuid();

    const fakeGame = new FakeGame();
    const game = await gamesRepository.create({
      name: fakeGame.name,
      description: fakeGame.description,
      administrators: [userId],
    } as IGame);

    const fetchedGame = await showGames.execute(game.id, userId);

    expect(fetchedGame).toEqual(game);
  });

  it('should return undefined when trying to fetch a game you do not own', async () => {
    const gamesRepository = new FakeGamesRepository();
    const showGames = new ShowGameService(gamesRepository);
    const userId = uuid();

    const fakeGame = new FakeGame();
    const game = await gamesRepository.create({
      name: fakeGame.name,
      description: fakeGame.description,
      administrators: ['random-user-id'],
    } as IGame);

    const fetchedGame = await showGames.execute(game.id, userId);

    expect(fetchedGame).toBeUndefined();
  });
});
