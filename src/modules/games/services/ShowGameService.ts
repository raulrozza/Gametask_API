import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@modules/games/repositories';

@injectable()
export default class ShowGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute(id: string, userId: string) {
    return await this.gamesRepository.findOne(id, userId);
  }
}
