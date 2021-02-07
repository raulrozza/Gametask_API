import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@modules/games/repositories';
import { IGame } from '@modules/games/entities';

@injectable()
export default class ListGamesService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute(userId: string): Promise<IGame[]> {
    return await this.gamesRepository.findAllFromUser(userId);
  }
}
