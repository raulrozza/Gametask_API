import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@shared/domain/repositories';

@injectable()
export default class ShowUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string) {
    return await this.usersRepository.findOne(id);
  }
}
