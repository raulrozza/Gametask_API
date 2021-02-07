import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import { RequestError } from '@shared/errors/implementations';
import FakeGame from '../fakes/FakeGame';
import FakeGamesRepository from '../repositories/fakes/FakeGamesRepository';
import UpdateGameAvatarService from './UpdateGameAvatarService';

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

    const fakeGame = new FakeGame();

    const game = await gamesRepository.create(fakeGame);
    const filename = 'avatar.jpg';

    const updatedGame = await updateGameAvatar.execute({
      filename,
      id: game.id,
    });

    expect(updatedGame.image).toBe(filename);
  });

  it('should update the game avatar and delete the old one', async () => {
    const { updateGameAvatar, storageProvider, gamesRepository } = getService();
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const fakeGame = new FakeGame();

    const game = await gamesRepository.create(fakeGame);
    const filename = 'avatar.jpg';

    await updateGameAvatar.execute({ filename: 'first_file', id: game.id });
    const updatedGame = await updateGameAvatar.execute({
      filename,
      id: game.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('first_file', 'game');
    expect(updatedGame.image).toBe(filename);
  });

  it('should throw when sending an invalid id', async () => {
    const { updateGameAvatar } = getService();

    await expect(
      updateGameAvatar.execute({ filename: 'avatar.jpg', id: 'invalid id' }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
