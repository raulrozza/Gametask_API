import faker from 'faker';

import { IUser } from '@shared/domain/entities';

interface IConstructor {
  id?: string;
}

export default class FakeUser implements IUser {
  public id: string;
  public firstname = faker.name.firstName();
  public lastname = faker.name.lastName();
  public email = faker.internet.email();
  public password = faker.internet.password(6);

  constructor({ id }: IConstructor = {}) {
    this.id = id || '';
  }
}
