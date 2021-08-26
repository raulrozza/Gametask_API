import FakeStorageProvider from '@shared/domain/providers/fakes/FakeStorageProvider';
import { RequestError } from '@shared/infra/errors';
import { FakeGamesRepository } from '@shared/domain/repositories/fakes';
import UpdateGameAvatarService from './UpdateGameAvatarService';
import { FakeGame, FakeUser } from '@shared/domain/entities/fakes';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';

const getService = () => {
  const gamesRepository = new FakeGamesRepository();
  const storageProvider = new FakeStorageProvider();

  const updateGameAvatar = new UpdateGameAvatarService(
    gamesRepository,
    storageProvider,
  );

  return { updateGameAvatar, storageProvider, gamesRepository };
};

describe('UpdateGameAvatar', () => {
  it('should upload the game avatar', async () => {
    const { updateGameAvatar, gamesRepository } = getService();

    const fakeUser = new FakeUser();
    const fakeGame = new FakeGame();

    const game = await gamesRepository.create(
      new CreateGameAdapter({
        creatorId: fakeUser.id,
        name: fakeGame.name,
        description: fakeGame.description,
      }),
    );
    const filename = 'avatar.jpg';

    const updatedGame = await updateGameAvatar.execute({
      filename,
      id: game.id,
      userId: 'fake_id',
    });

    expect(updatedGame.image).toBe(filename);
  });

  it('should update the game avatar and delete the old one', async () => {
    const { updateGameAvatar, storageProvider, gamesRepository } = getService();
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const fakeGame = new FakeGame();
    const fakeUser = new FakeUser();

    const game = await gamesRepository.create(
      new CreateGameAdapter({
        creatorId: fakeUser.id,
        name: fakeGame.name,
        description: fakeGame.description,
      }),
    );
    const filename = 'avatar.jpg';

    await updateGameAvatar.execute({
      filename: 'first_file',
      id: game.id,
      userId: 'fake_id',
    });
    const updatedGame = await updateGameAvatar.execute({
      filename,
      id: game.id,
      userId: 'fake_id',
    });

    expect(deleteFile).toHaveBeenCalledWith('first_file', 'game');
    expect(updatedGame.image).toBe(filename);
  });

  it('should throw when sending an invalid id', async () => {
    const { updateGameAvatar } = getService();

    await expect(
      updateGameAvatar.execute({
        filename: 'avatar.jpg',
        id: 'invalid id',
        userId: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
