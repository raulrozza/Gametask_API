import CreateGameService from '@modules/games/services/CreateGameService';
import {
  FakeGamesRepository,
  FakeLeaderboardsRepository,
} from '@shared/domain/repositories/fakes';
import { FakeGame, FakeUser } from '@shared/domain/entities/fakes';

describe('CreateGameService', () => {
  it('should create the game', async () => {
    const gamesRepository = new FakeGamesRepository();
    const leaderboardsRepository = new FakeLeaderboardsRepository();
    const createGame = new CreateGameService(
      gamesRepository,
      leaderboardsRepository,
    );

    const fakeGame = new FakeGame();
    const creator = new FakeUser();

    const payload = {
      creatorId: creator.id,
      name: fakeGame.name,
      description: fakeGame.description,
    };

    const game = await createGame.execute(payload);

    const administrator = game.administrators.find(
      adm => adm.id === creator.id,
    );

    expect(game).toHaveProperty('id');
    expect(game.name).toBe(fakeGame.name);
    expect(game.description).toBe(fakeGame.description);
    expect(administrator).toBeDefined();
  });
});
