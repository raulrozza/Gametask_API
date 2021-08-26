import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IUser } from '@shared/domain/entities';
import { IUsersRepository } from '@shared/domain/repositories';

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
