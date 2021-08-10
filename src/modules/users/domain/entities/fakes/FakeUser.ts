import faker from 'faker';

import { IUser } from '@modules/users/domain/entities';

export default class FakeUser implements IUser {
  public id: string = '';
  public firstname = faker.name.firstName();
  public lastname = faker.name.lastName();
  public email = faker.internet.email();
  public password = faker.internet.password(6);
}
