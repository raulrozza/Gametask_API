import { container } from 'tsyringe';
import UsersRepository from '@modules/users/infra/mongoose/repositories/UsersRepository';

container.registerSingleton('UsersRepository', UsersRepository);
