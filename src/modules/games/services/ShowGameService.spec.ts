import { FakeGamesRepository } from '@shared/domain/repositories/fakes';
import ShowGameService from './ShowGameService';
import CreateGameAdapter from '@shared/domain/adapters/CreateGame';
import { FakeGame, FakeUser } from '@shared/domain/entities/fakes';

describe('ShowGameService', () => {
  it('should return the correct game', async () => {
    const gamesRepository = new FakeGamesRepository();
    const showGames = new ShowGameService(gamesRepository);
    const user = new FakeUser();

    const fakeGame = new FakeGame();
    const game = await gamesRepository.create(
      new CreateGameAdapter({
        name: fakeGame.name,
        description: fakeGame.description,
        creatorId: user.id,
      }),
    );

    const fetchedGame = await showGames.execute({
      gameId: game.id,
    });

    expect(fetchedGame).toEqual(game);
  });
});
