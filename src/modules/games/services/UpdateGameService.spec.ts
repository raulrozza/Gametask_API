import { RequestError } from '@shared/errors/implementations';
import { v4 as uuid } from 'uuid';

import FakeGame from '../fakes/FakeGame';
import FakeGamesRepository from '../repositories/fakes/FakeGamesRepository';
import UpdateGameService from './UpdateGameService';

describe('UpdateGameService', () => {
  it('should update the game correctly', async () => {
    const gamesRepository = new FakeGamesRepository();
    const updateGame = new UpdateGameService(gamesRepository);

    const adminId = uuid();
    const fakeGame = new FakeGame();
    fakeGame.administrators = [adminId];

    const game = await gamesRepository.create(fakeGame);

    const updatedGame = await updateGame.execute({
      adminId,
      id: game.id,
      name: 'New name',
      description: 'New description',
      levelInfo: [{ level: 1, requiredExperience: 10 }],
      theme: { primary: '#AAAAAA', secondary: '#550033' },
      ranks: [{ color: '#0000BB', level: 3, name: 'My rank', tag: 'MRK' }],
    });

    expect(updatedGame).not.toEqual(game);
  });

  it('should throw when trying to update a non existing game', async () => {
    const gamesRepository = new FakeGamesRepository();
    const updateGame = new UpdateGameService(gamesRepository);

    const adminId = uuid();
    const fakeGame = new FakeGame();

    await expect(
      updateGame.execute({
        adminId,
        ...fakeGame,
        id: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
