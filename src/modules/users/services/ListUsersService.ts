import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IUser } from '@modules/users/domain/entities';
import { IUsersRepository } from '@modules/users/domain/repositories';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<IUser[]> {
    return await this.usersRepository.findAll();
  }
}
