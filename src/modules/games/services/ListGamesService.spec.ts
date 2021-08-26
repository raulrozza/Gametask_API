import ListGamesService from './ListGamesService';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { FakeGame, FakeUser } from '@shared/domain/entities/fakes';
import { FakeGamesRepository } from '@shared/domain/repositories/fakes';

describe('ListGamesService', () => {
  it('should list only the user owned games', async () => {
    const gamesRepository = new FakeGamesRepository();

    const listGames = new ListGamesService(gamesRepository);

    const user = new FakeUser();

    const fakeGame = new FakeGame();

    await gamesRepository.create(
      new CreateGameAdapter({
        name: fakeGame.name,
        description: fakeGame.description,
        creatorId: user.id,
      }),
    );
    await gamesRepository.create(
      new CreateGameAdapter({
        name: fakeGame.name,
        description: fakeGame.description,
        creatorId: user.id,
      }),
    );
    await gamesRepository.create(
      new CreateGameAdapter({
        name: 'not-my-game-id',
        description: fakeGame.description,
        creatorId: user.id,
      }),
    );

    const games = await listGames.execute(user.id);

    expect(games).toHaveLength(2);
  });
});
