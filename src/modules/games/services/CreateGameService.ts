import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@modules/games/domain/repositories';
import ICreateGameDTO from '@modules/games/domain/dtos/ICreateGameDTO';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { IGame } from '@shared/domain/entities';
import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import { ILeaderboardsRepository } from '@shared/domain/repositories';

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
    const createGame = new CreateGameAdapter({ name, description, creatorId });

    const game = await this.gamesRepository.create(createGame);

    const createLeaderboard = new CreateLeaderboardAdapter({ game: game.id });

    await this.leaderboardsRepository.create(createLeaderboard);

    return game;
  }
}
