import { v4 as uuid } from 'uuid';

import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import ListGamesService from './ListGamesService';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { FakeGame } from '@shared/domain/entities/fakes';

describe('ListGamesService', () => {
  it('should list only the user owned games', async () => {
    const gamesRepository = new FakeGamesRepository();

    const listGames = new ListGamesService(gamesRepository);

    const userId = uuid();

    const fakeGame = new FakeGame();

    await gamesRepository.create(
      new CreateGameAdapter({
        name: fakeGame.name,
        description: fakeGame.description,
        creatorId: userId,
      }),
    );
    await gamesRepository.create(
      new CreateGameAdapter({
        name: fakeGame.name,
        description: fakeGame.description,
        creatorId: userId,
      }),
    );
    await gamesRepository.create(
      new CreateGameAdapter({
        name: 'not-my-game-id',
        description: fakeGame.description,
        creatorId: userId,
      }),
    );

    const games = await listGames.execute(userId);

    expect(games).toHaveLength(2);
  });
});
