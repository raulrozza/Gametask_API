import { isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';
import { IUser } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories';
import { User } from '@modules/users/infra/mongoose/entities';
import { IUserDocument } from '@modules/users/infra/mongoose/entities/User';

export default class UsersRepository
  implements IUsersRepository<IUserDocument> {
  public async findAll(): Promise<IUserDocument[]> {
    const users = await User.find({}, { password: 0 });

    return users;
  }

  public async findOne(id: string): Promise<IUserDocument> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const user = await User.findOne({ _id: id }, { password: 0 });

    return user || undefined;
  }

  public async findOneByEmail(email: string): Promise<IUserDocument> {
    const user = await User.findOne({ email });

    return user || undefined;
  }

  public async create({
    firstname,
    lastname,
    email,
    password,
  }: IUser): Promise<IUserDocument> {
    const createdUser = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    return createdUser;
  }

  public async update({
    id,
    firstname,
    lastname,
    image,
  }: IUser): Promise<IUserDocument> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstname,
          lastname,
          image,
        },
      },
      { new: true },
    );

    return updatedUser;
  }
}
