import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@modules/games/repositories';
import IShowGameDTO from '@modules/games/dtos/IShowGameDTO';

@injectable()
export default class ShowGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({ gameId, userId }: IShowGameDTO) {
    return this.gamesRepository.findOne(gameId, userId);
  }
}
