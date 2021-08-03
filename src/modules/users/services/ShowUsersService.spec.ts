import faker from 'faker';
import { IUser } from '@modules/users/domain/entities';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUsersService from './ShowUsersService';

describe('ShowUsersService', () => {
  it('should return the correct user', async () => {
    const usersRepository = new FakeUsersRepository();
    const showUsers = new ShowUsersService(usersRepository);

    const user = await usersRepository.create({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(6),
    } as IUser);

    const fetchedUser = await showUsers.execute(user.id);

    expect(fetchedUser).toEqual(user);
  });
});
