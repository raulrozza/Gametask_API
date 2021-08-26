import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IPlayersRepository } from '@modules/players/domain/repositories';
import { IPlayer } from '@modules/players/domain/entities';

@injectable()
export default class ListPlayersService {
  constructor(
    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,
  ) {}

  public async execute(userId: string): Promise<IPlayer[]> {
    return await this.playersRepository.findAllFromUser(userId);
  }
}
