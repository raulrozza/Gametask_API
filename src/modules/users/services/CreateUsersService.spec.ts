import { RequestError } from '@shared/infra/errors';
import faker from 'faker';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import CreateUsersService from './CreateUsersService';

const getService = () => {
  const usersRepository = new FakeUsersRepository();
  const hashProvider = new FakeHashProvider();

  const service = new CreateUsersService(usersRepository, hashProvider);

  return service;
};

describe('CreateUsersService', () => {
  it('should create an user correctly', async () => {
    const createUsers = getService();

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(6),
    };

    const newUser = await createUsers.execute(payload);

    expect(newUser).toHaveProperty('id');
    expect(newUser.firstname).toBe(payload.firstname);
  });

  it('should not be able to create a user with an existing email', async () => {
    const createUsers = getService();

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(6),
    };

    await createUsers.execute(payload);

    await expect(createUsers.execute(payload)).rejects.toBeInstanceOf(
      RequestError,
    );
  });
});
