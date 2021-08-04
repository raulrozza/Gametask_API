import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { ICreateUserDTO } from '@modules/users/domain/dtos';
import IHashProvider from '@modules/users/domain/providers/IHashProvider';
import { IUsersRepository } from '@modules/users/domain/repositories';
import { RequestError } from '@shared/infra/errors';

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
