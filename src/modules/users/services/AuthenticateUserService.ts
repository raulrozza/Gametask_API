import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import { RequestError } from '@shared/errors/implementations';

import { IAuthenticateUserDTO } from '@modules/users/dtos';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ITokenProvider from '@modules/users/providers/TokenProvider/models/ITokenProvider';
import { IUsersRepository } from '@modules/users/repositories';

interface IExecuteResponse {
  token: string;
}

const PASSWORD_EMAIL_ERROR_MESSAGE = 'Invalid combination of email/password';

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
  ) {}

  public async execute({
    email,
    password,
  }: IAuthenticateUserDTO): Promise<IExecuteResponse> {
    const foundUser = await this.usersRepository.findOneByEmail(email);

    if (!foundUser)
      throw new RequestError(
        PASSWORD_EMAIL_ERROR_MESSAGE,
        errorCodes.USER_PASSWORD_DONT_MATCH,
      );

    const match = await this.hashProvider.compareHash(
      password,
      foundUser.password,
    );

    if (!match)
      throw new RequestError(
        PASSWORD_EMAIL_ERROR_MESSAGE,
        errorCodes.USER_PASSWORD_DONT_MATCH,
      );

    const token = await this.tokenProvider.sign({ id: foundUser.id });

    return { token };
  }
}
