import FakeStorageProvider from '@shared/domain/providers/fakes/FakeStorageProvider';
import { UpdateUserAvatarService } from '.';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import FakeUser from '@shared/domain/entities/fakes/FakeUser';
import { RequestError } from '@shared/infra/errors';

const getService = () => {
  const usersRepository = new FakeUsersRepository();
  const storageProvider = new FakeStorageProvider();

  const updateUserAvatar = new UpdateUserAvatarService(
    usersRepository,
    storageProvider,
  );

  return { updateUserAvatar, storageProvider, usersRepository };
};

describe('UpdateUserAvatar', () => {
  it('should upload the user avatar', async () => {
    const { updateUserAvatar, usersRepository } = getService();

    const fakeUser = new FakeUser();

    const user = await usersRepository.create(fakeUser);
    const filename = 'avatar.jpg';

    const updatedUser = await updateUserAvatar.execute({
      filename,
      id: user.id,
    });

    expect(updatedUser.image).toBe(filename);
  });

  it('should update the user avatar and delete the old one', async () => {
    const { updateUserAvatar, storageProvider, usersRepository } = getService();
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const fakeUser = new FakeUser();

    const user = await usersRepository.create(fakeUser);
    const filename = 'avatar.jpg';

    await updateUserAvatar.execute({ filename: 'first_file', id: user.id });
    const updatedUser = await updateUserAvatar.execute({
      filename,
      id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('first_file', 'user');
    expect(updatedUser.image).toBe(filename);
  });

  it('should throw when sending an invalid id', async () => {
    const { updateUserAvatar } = getService();

    await expect(
      updateUserAvatar.execute({ filename: 'avatar.jpg', id: 'invalid id' }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
