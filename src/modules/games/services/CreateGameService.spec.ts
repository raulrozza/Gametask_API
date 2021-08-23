import { v4 as uuid } from 'uuid';
import FakeGame from '../fakes/FakeGame';
import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import CreateGameService from '@modules/games/services/CreateGameService';
import FakeLeaderboardsRepository from '@modules/games/domain/repositories/fakes/FakeLeaderboardsRepository';

describe('CreateGameService', () => {
  it('should create the game', async () => {
    const gamesRepository = new FakeGamesRepository();
    const leaderboardsRepository = new FakeLeaderboardsRepository();
    const createGame = new CreateGameService(
      gamesRepository,
      leaderboardsRepository,
    );

    const fakeGame = new FakeGame();
    const creatorId = uuid();

    const payload = {
      creatorId,
      name: fakeGame.name,
      description: fakeGame.description,
    };

    const game = await createGame.execute(payload);

    expect(game).toHaveProperty('id');
    expect(game.name).toBe(fakeGame.name);
    expect(game.description).toBe(fakeGame.description);
    expect(game.administrators).toContain(creatorId);
  });
});
