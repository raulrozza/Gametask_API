import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@shared/domain/repositories';
import { IGame } from '@shared/domain/entities';

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
