import { RequestError } from '@shared/infra/errors';

import { FakeGamesRepository } from '@shared/domain/repositories/fakes';
import UpdateGameService from './UpdateGameService';
import { FakeGame, FakeUser } from '@shared/domain/entities/fakes';
import CreateGameAdapter from '@shared/domain/adapters/CreateGame';

describe('UpdateGameService', () => {
  it('should update the game correctly', async () => {
    const gamesRepository = new FakeGamesRepository();
    const updateGame = new UpdateGameService(gamesRepository);

    const admin = new FakeUser();
    const fakeGame = new FakeGame();

    const game = await gamesRepository.create(
      new CreateGameAdapter({
        creatorId: admin.id,
        name: fakeGame.name,
        description: fakeGame.description,
      }),
    );

    const updatedGame = await updateGame.execute({
      adminId: admin.id,
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

    const admin = new FakeUser();
    const fakeGame = new FakeGame();

    await expect(
      updateGame.execute({
        adminId: admin.id,
        ...fakeGame,
        id: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
