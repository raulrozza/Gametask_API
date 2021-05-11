import { v4 as uuid } from 'uuid';
import { IUser } from '@modules/users/entities';
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

  public async create(user: IUser): Promise<IUser> {
    user.id = uuid();

    this.users.push(user);

    return Promise.resolve(user);
  }

  public async update({ id, ...user }: IUser): Promise<IUser> {
    const foundIndex = this.users.findIndex(storedUser => storedUser.id === id);

    const foundUser = this.users[foundIndex];

    const updatedUser = {
      ...foundUser,
      ...user,
    };

    this.users[foundIndex] = updatedUser;

    return updatedUser;
  }
}
