import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IGamesRepository,
  ILeaderboardsRepository,
} from '@shared/domain/repositories';
import ICreateGameDTO from '@modules/games/domain/dtos/ICreateGameDTO';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { IGame } from '@shared/domain/entities';
import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';

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
    const game = await this.gamesRepository.create(
      new CreateGameAdapter({ name, description, creatorId }),
    );

    await this.leaderboardsRepository.create(
      new CreateLeaderboardAdapter({ game: game.id }),
    );

    return game;
  }
}
