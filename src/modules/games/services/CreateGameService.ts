import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@modules/games/repositories';
import { IGame } from '@modules/games/entities';
import ICreateGameDTO from '@modules/games/dtos/ICreateGameDTO';

@injectable()
export default class CreateGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({
    creatorId,
    name,
    description,
  }: ICreateGameDTO): Promise<IGame> {
    const createdGame = await this.gamesRepository.create({
      name,
      description,
      administrators: [creatorId],
    });

    return createdGame;
  }
}
