import { IUser } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories';
import { User } from '@modules/users/infra/mongoose/entities';
import { IUserDocument } from '../entities/User';

export default class UsersRepository
  implements IUsersRepository<IUserDocument> {
  public async findAll(): Promise<IUserDocument[]> {
    const users = await User.find({}, { password: 0 });

    return users;
  }

  public async findOne(id: string): Promise<IUserDocument> {
    const user = await User.findOne({ _id: id }, { password: 0 });

    return user || undefined;
  }

  public async findOneByEmail(email: string): Promise<IUserDocument> {
    const user = await User.findOne({ email });

    return user || undefined;
  }

  public async create(user: IUser): Promise<IUserDocument> {
    const createdUser = await User.create(user);

    return createdUser;
  }

  public async update({ id, ...user }: IUser): Promise<IUserDocument> {
    const updatedUser = await User.updateOne(
      {
        _id: id,
      },
      {
        $set: user,
      },
    );

    return updatedUser;
  }
}
