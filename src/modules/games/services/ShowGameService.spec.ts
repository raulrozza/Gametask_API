import { v4 as uuid } from 'uuid';

import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import ShowGameService from './ShowGameService';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { FakeGame } from '@shared/domain/entities/fakes';

describe('ShowGameService', () => {
  it('should return the correct game', async () => {
    const gamesRepository = new FakeGamesRepository();
    const showGames = new ShowGameService(gamesRepository);
    const userId = uuid();

    const fakeGame = new FakeGame();
    const game = await gamesRepository.create(
      new CreateGameAdapter({
        name: fakeGame.name,
        description: fakeGame.description,
        creatorId: userId,
      }),
    );

    const fetchedGame = await showGames.execute({
      gameId: game.id,
    });

    expect(fetchedGame).toEqual(game);
  });
});
