import FakeStorageProvider from '@shared/domain/providers/fakes/FakeStorageProvider';
import { RequestError } from '@shared/infra/errors';
import FakeGame from '../fakes/FakeGame';
import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
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
    fakeGame.administrators = ['fake_id'];

    const game = await gamesRepository.create(fakeGame);
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
    fakeGame.administrators = ['fake_id'];

    const game = await gamesRepository.create(fakeGame);
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
