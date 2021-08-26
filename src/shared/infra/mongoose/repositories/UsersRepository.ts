import { isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IUser } from '@shared/domain/entities';
import { IUsersRepository } from '@shared/domain/repositories';
import User, { IUserDocument } from '@shared/infra/mongoose/entities/User';

export default class UsersRepository implements IUsersRepository {
  public async findAll(): Promise<IUser[]> {
    const users = await User.find({}, { password: 0 });

    return users;
  }

  public async findOne(id: string): Promise<IUser | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const user = await User.findOne({ _id: id }, { password: 0 });

    return user || undefined;
  }

  public async findOneByEmail(email: string): Promise<IUser | undefined> {
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
  }: IUser): Promise<IUser> {
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

    if (!updatedUser)
      throw new RequestError('User not found', errorCodes.COULD_NOT_FIND_USER);

    return updatedUser;
  }
}
