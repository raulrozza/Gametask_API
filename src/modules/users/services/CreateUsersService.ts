import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';

// Modules
import { ICreateUserDTO } from '@modules/users/dtos';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '@modules/users/repositories';

@injectable()
export default class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    firstname,
    lastname,
    email,
    password,
  }: ICreateUserDTO) {
    const existingUser = await this.usersRepository.findOneByEmail(email);

    if (existingUser)
      throw new RequestError(
        'This user already exists',
        errorCodes.USER_ALREADY_EXISTS,
      );

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
