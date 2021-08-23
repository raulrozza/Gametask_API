import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IGamesRepository,
  ILeaderboardsRepository,
} from '@modules/games/domain/repositories';
import { IGame } from '@modules/games/entities';
import ICreateGameDTO from '@modules/games/domain/dtos/ICreateGameDTO';

@injectable()
export default class CreateGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('LeaderboardsRepository')
    private leaderboardsRepository: ILeaderboardsRepository,
  ) {}

  public async execute({
    creatorId,
    name,
    description,
  }: ICreateGameDTO): Promise<IGame> {
    const game = await this.gamesRepository.create({
      name,
      description,
      administrators: [creatorId],
      levelInfo: [],
      ranks: [],
    });

    await this.leaderboardsRepository.create({
      game: game.id,
      createdAt: new Date(),
    });

    return game;
  }
}
