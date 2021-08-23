import { v4 as uuid } from 'uuid';

import { ICreateUserDTO, IUpdateUserDTO } from '@modules/users/domain/dtos';
import { IUser } from '@shared/domain/entities';

import { IUsersRepository } from '..';

export default class FakeUsersRepository implements IUsersRepository {
  private readonly users: IUser[] = [];

  public async findAll(): Promise<IUser[]> {
    return Promise.resolve(this.users);
  }

  public async findOne(id: string): Promise<IUser | undefined> {
    const foundUser = this.users.find(user => user.id === id);

    return Promise.resolve(foundUser);
  }

  public async findOneByEmail(email: string): Promise<IUser | undefined> {
    const foundUser = this.users.find(user => user.email === email);

    return Promise.resolve(foundUser);
  }

  public async create({
    email,
    firstname,
    lastname,
    password,
  }: ICreateUserDTO): Promise<IUser> {
    const user: IUser = {
      id: uuid(),
      email,
      firstname,
      lastname,
      password,
    };

    this.users.push(user);

    return Promise.resolve(user);
  }

  public async update({ id, ...data }: IUpdateUserDTO): Promise<IUser> {
    const foundIndex = this.users.findIndex(storedUser => storedUser.id === id);

    const foundUser = this.users[foundIndex];

    const updatedUser = {
      ...foundUser,
      ...data,
    };

    this.users[foundIndex] = updatedUser;

    return updatedUser;
  }
}
