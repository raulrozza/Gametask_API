import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IGamesRepository,
  ILeaderboardsRepository,
} from '@modules/games/domain/repositories';
import { IGame } from '@modules/games/domain/entities';
import ICreateGameDTO from '@modules/games/domain/dtos/ICreateGameDTO';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';

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

    await this.leaderboardsRepository.create({
      game: game.id,
      createdAt: new Date(),
    });

    return game;
  }
}
