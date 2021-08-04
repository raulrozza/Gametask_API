import { container } from 'tsyringe';

import UsersRepository from '@modules/users/infra/mongoose/repositories/UsersRepository';
import { IUsersRepository } from '@modules/users/domain/repositories';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import ITokenProvider from './TokenProvider/models/ITokenProvider';
import JwtTokenProvider from './TokenProvider/implementations/JwtTokenProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JwtTokenProvider);
