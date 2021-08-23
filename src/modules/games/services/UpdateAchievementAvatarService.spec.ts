import { v4 as uuid } from 'uuid';
import FakeStorageProvider from '@shared/domain/providers/fakes/FakeStorageProvider';
import { RequestError } from '@shared/infra/errors';
import FakeAchievement from '../fakes/FakeAchievement';
import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import UpdateAchievementAvatarService from './UpdateAchievementAvatarService';

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

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);

    const achievement = await achievementsRepository.create(fakeAchievement);
    const filename = 'avatar.jpg';

    const updatedAchievement = await updateAchievementAvatar.execute({
      filename,
      id: achievement.id,
      gameId,
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

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement(gameId);

    const achievement = await achievementsRepository.create(fakeAchievement);
    const filename = 'avatar.jpg';

    await updateAchievementAvatar.execute({
      filename: 'first_file',
      id: achievement.id,
      gameId,
    });
    const updatedAchievement = await updateAchievementAvatar.execute({
      filename,
      id: achievement.id,
      gameId,
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
