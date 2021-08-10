import faker from 'faker';

import { ListUsersService } from '.';
import { IUser } from '@modules/users/domain/entities';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';

describe('ListUsersService', () => {
  it('should list both the users created', async () => {
    const usersRepository = new FakeUsersRepository();

    const listUsers = new ListUsersService(usersRepository);

    const payload = [0, 0].map(() => ({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(6),
    }));

    await usersRepository.create(payload[0] as IUser);
    await usersRepository.create(payload[1] as IUser);

    const users = await listUsers.execute();

    expect(users).toHaveLength(2);
  });
});
