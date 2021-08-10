import { container } from 'tsyringe';

import UsersRepository from '@modules/users/infra/mongoose/repositories/UsersRepository';
import { IUsersRepository } from '@modules/users/domain/repositories';

import './providers';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
