import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import IStorageProvider from '@shared/domain/providers/IStorageProvider';
import { RequestError } from '@shared/infra/errors';

import { IUsersRepository } from '@modules/users/domain/repositories';
import { IUpdateUserAvatarDTO } from '@modules/users/domain/dtos';

const USER_FOLDER = 'user';

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ filename, id }: IUpdateUserAvatarDTO) {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new RequestError(
        'Could not find user on database',
        errorCodes.COULD_NOT_FIND_USER,
      );
    }

    if (user.image)
      await this.storageProvider.deleteFile(user.image, USER_FOLDER);

    await this.storageProvider.saveFile(filename, USER_FOLDER);

    const updatedUser = await this.usersRepository.update({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      image: filename,
    });

    return updatedUser;
  }
}
