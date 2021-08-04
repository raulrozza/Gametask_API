import FakeUsersRepository from '@modules/users/doma@modules/users/domain/repositories/fakes/FakeUsersRepository';
import FakeUser from '@modules/users/fakes/FakeUser';
import UpdateUserService from './UpdateUserService';
import { RequestError } from '@shared/infra/errors';

describe('UpdateUserService', () => {
  it('should correclty update the user', async () => {
    const usersRepository = new FakeUsersRepository();
    const updateUser = new UpdateUserService(usersRepository);

    const user = new FakeUser();
    await usersRepository.create(user);

    const payload = {
      id: user.id,
      firstname: 'New name',
      lastname: 'New lastname',
    };

    const updatedUser = await updateUser.execute(payload);

    expect(updatedUser.id).toBe<string>(user.id);
    expect(updatedUser.firstname).toBe<string>('New name');
    expect(updatedUser.lastname).toBe<string>('New lastname');
  });

  it('should throw an error when trying to update an invalid user', async () => {
    const usersRepository = new FakeUsersRepository();
    const updateUser = new UpdateUserService(usersRepository);

    const payload = {
      id: 'Invalid id',
      firstname: 'Invalid name',
      lastname: 'Invalid lastname',
    };

    await expect(updateUser.execute(payload)).rejects.toBeInstanceOf(
      RequestError,
    );
  });
});
