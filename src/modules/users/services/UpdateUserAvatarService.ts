import 'reflect-metadata';

import errorCodes from '@config/errorCodes';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { RequestError } from '@shared/errors/implementations';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../repositories';

const USER_FOLDER = 'user';

interface IExecute {
  filename: string;
  id: string;
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ filename, id }: IExecute) {
    const user = await this.usersRepository.findOne(id);

    if (!user)
      throw new RequestError(
        'Could not find user on database',
        errorCodes.COULD_NOT_FIND_USER,
      );

    if (user.image)
      await this.storageProvider.deleteFile(user.image, USER_FOLDER);

    await this.storageProvider.saveFile(filename, USER_FOLDER);
    user.image = filename;

    await this.usersRepository.update(user);

    return user;
  }
}
