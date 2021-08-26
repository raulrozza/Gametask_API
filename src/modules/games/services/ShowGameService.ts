import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@shared/domain/repositories';
import IShowGameDTO from '@modules/games/domain/dtos/IShowGameDTO';

@injectable()
export default class ShowGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({ gameId }: IShowGameDTO) {
    return this.gamesRepository.findOne(gameId);
  }
}
