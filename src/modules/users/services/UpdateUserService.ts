import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import { IUser } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories';
import { IUpdateUserDTO } from '@modules/users/dtos';
import { RequestError } from '@shared/errors/implementations';

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

    foundUser.firstname = firstname;
    foundUser.lastname = lastname;

    await this.usersRepository.update(foundUser);

    return foundUser;
  }
}