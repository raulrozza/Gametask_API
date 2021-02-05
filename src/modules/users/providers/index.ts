import { container } from 'tsyringe';

import UsersRepository from '@modules/users/infra/mongoose/repositories/UsersRepository';
import { IUsersRepository } from '@modules/users/repositories';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
