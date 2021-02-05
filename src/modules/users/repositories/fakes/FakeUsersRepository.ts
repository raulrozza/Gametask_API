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

  public async create(user: IUser): Promise<IUser> {
    this.users.push(user);

    return Promise.resolve(user);
  }
}
