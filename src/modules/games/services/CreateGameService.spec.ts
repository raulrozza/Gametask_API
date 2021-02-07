import { v4 as uuid } from 'uuid';
import FakeGame from '../fakes/FakeGame';
import FakeGamesRepository from '../repositories/fakes/FakeGamesRepository';
import CreateGameService from './CreateGameService';

describe('CreateGameService', () => {
  it('should create the game', async () => {
    const gamesRepository = new FakeGamesRepository();
    const createGame = new CreateGameService(gamesRepository);

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
