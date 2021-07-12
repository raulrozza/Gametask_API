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

    const fetchedGame = await showGames.execute({
      gameId: game.id,
    });

    expect(fetchedGame).toEqual(game);
  });
});
