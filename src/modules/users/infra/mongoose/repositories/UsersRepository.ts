import { IUser } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories';
import { User } from '@modules/users/infra/mongoose/entities';

export default class UsersRepository implements IUsersRepository {
  public async findAll(): Promise<IUser[]> {
    const users = await User.find({}, { password: 0 });

    return users;
  }

  public async findOne(id: string): Promise<IUser> {
    const user = await User.findOne({ id }, { password: 0 });

    return user || undefined;
  }

  public async create(user: IUser): Promise<IUser> {
    const createdUser = await User.create(user);

    return createdUser;
  }
}
