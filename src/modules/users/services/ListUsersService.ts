import { inject, injectable } from 'tsyringe';
import { IUser } from '../entities';
import { IUsersRepository } from '../repositories';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<IUser[]> {
    return this.usersRepository.findAll();
  }
}
