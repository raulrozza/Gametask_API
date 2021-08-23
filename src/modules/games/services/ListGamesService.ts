import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@modules/games/domain/repositories';
import { IGame } from '@modules/games/entities';

@injectable()
export default class ListGamesService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute(userId: string): Promise<IGame[]> {
    return this.gamesRepository.findAllFromUser(userId);
  }
}
