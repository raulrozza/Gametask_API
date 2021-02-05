import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';
import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ITokenProvider from '../providers/TokenProvider/models/ITokenProvider';
import { IUsersRepository } from '../repositories';

interface IExecuteParams {
  email: string;
  password: string;
}

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
  }: IExecuteParams): Promise<IExecuteResponse> {
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
