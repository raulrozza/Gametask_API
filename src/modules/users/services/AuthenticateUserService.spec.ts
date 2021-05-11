import { RequestError } from '@shared/errors/implementations';
import FakeUser from '../fakes/FakeUser';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '../providers/TokenProvider/fakes/FakeTokenProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';

const getService = () => {
  const usersRepository = new FakeUsersRepository();
  const hashProvider = new FakeHashProvider();
  const tokenProvider = new FakeTokenProvider();
  const authenticateUser = new AuthenticateUserService(
    usersRepository,
    hashProvider,
    tokenProvider,
  );

  return {
    usersRepository,
    authenticateUser,
  };
};

describe('AuthenticateUser', () => {
  it('should authenticate the user', async () => {
    const { usersRepository, authenticateUser } = getService();

    const user = new FakeUser();
    await usersRepository.create(user);

    const response = await authenticateUser.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty<string>('token');
  });

  it('should not be able to authenticate an user with an incorrect email', async () => {
    const { usersRepository, authenticateUser } = getService();

    const user = new FakeUser();
    await usersRepository.create(user);

    await expect(
      authenticateUser.execute({
        email: 'my incorrect email',
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to authenticate an user with an incorrect password', async () => {
    const { usersRepository, authenticateUser } = getService();

    const user = new FakeUser();
    await usersRepository.create(user);

    await expect(
      authenticateUser.execute({
        email: user.email,
        password: 'my incorrect password',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
