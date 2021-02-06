import { inject, injectable } from 'tsyringe';
import { IUser } from '../entities';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../repositories';

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(): Promise<IUser> {}
}
