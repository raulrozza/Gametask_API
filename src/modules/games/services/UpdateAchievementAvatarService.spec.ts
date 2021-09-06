import FakeStorageProvider from '@shared/domain/providers/fakes/FakeStorageProvider';
import { RequestError } from '@shared/infra/errors';
import { FakeAchievementsRepository } from '@shared/domain/repositories/fakes';
import UpdateAchievementAvatarService from './UpdateAchievementAvatarService';
import { FakeAchievement, FakeGame } from '@shared/domain/entities/fakes';

const getService = () => {
  const achievementsRepository = new FakeAchievementsRepository();
  const storageProvider = new FakeStorageProvider();

  const updateAchievementAvatar = new UpdateAchievementAvatarService(
    achievementsRepository,
    storageProvider,
  );

  return { updateAchievementAvatar, storageProvider, achievementsRepository };
};

describe('UpdateAchievementAvatar', () => {
  it('should upload the achievement avatar', async () => {
    const { updateAchievementAvatar, achievementsRepository } = getService();

    const game = new FakeGame();
    const fakeAchievement = new FakeAchievement({ game: game.id });

    const achievement = await achievementsRepository.create({
      gameId: game.id,
      description: fakeAchievement.description,
      name: fakeAchievement.name,
      title: fakeAchievement.title?.id,
    });
    const filename = 'avatar.jpg';

    const updatedAchievement = await updateAchievementAvatar.execute({
      filename,
      id: achievement.id,
      gameId: game.id,
    });

    expect(updatedAchievement.image).toBe(filename);
  });

  it('should update the achievement avatar and delete the old one', async () => {
    const {
      updateAchievementAvatar,
      storageProvider,
      achievementsRepository,
    } = getService();
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const game = new FakeGame();
    const fakeAchievement = new FakeAchievement({ game: game.id });

    const achievement = await achievementsRepository.create({
      gameId: game.id,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      title: fakeAchievement.title?.id,
    });
    const filename = 'avatar.jpg';

    await updateAchievementAvatar.execute({
      filename: 'first_file',
      id: achievement.id,
      gameId: game.id,
    });
    const updatedAchievement = await updateAchievementAvatar.execute({
      filename,
      id: achievement.id,
      gameId: game.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('first_file', 'achievement');
    expect(updatedAchievement.image).toBe(filename);
  });

  it('should throw when sending an invalid id', async () => {
    const { updateAchievementAvatar } = getService();

    await expect(
      updateAchievementAvatar.execute({
        filename: 'avatar.jpg',
        id: 'invalid id',
        gameId: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
