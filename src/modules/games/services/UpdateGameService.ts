import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IUpdateGameDTO from '@modules/games/dtos/IUpdateGameDTO';
import { IGame } from '@modules/games/entities';
import { IGamesRepository } from '@modules/games/repositories';

@injectable()
export default class UpdateGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({
    adminId,
    id,
    name,
    description,
    theme,
    levelInfo,
    ranks,
  }: IUpdateGameDTO): Promise<IGame> {}
}
