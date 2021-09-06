import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import { IUser } from '@shared/domain/entities';
import { IUsersRepository } from '@shared/domain/repositories';
import { IUpdateUserDTO } from '@modules/users/domain/dtos';
import { RequestError } from '@shared/infra/errors';

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    firstname,
    lastname,
    id,
  }: IUpdateUserDTO): Promise<IUser> {
    const foundUser = await this.usersRepository.findOne(id);

    if (!foundUser)
      throw new RequestError('User not found.', errorCodes.COULD_NOT_FIND_USER);

    const updatedUser = await this.usersRepository.update({
      id: foundUser.id,
      firstname,
      lastname,
    });

    return updatedUser;
  }
}
