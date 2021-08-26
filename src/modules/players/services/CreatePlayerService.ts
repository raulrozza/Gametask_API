import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';

import { IGamesRepository } from '@shared/domain/repositories';
import { IUsersRepository } from '@modules/users/domain/repositories';
import { IPlayersRepository } from '@modules/players/domain/repositories';
import { IPlayer } from '@modules/players/domain/entities';
import ICreatePlayerDTO from '@modules/players/domain/dtos/ICreatePlayerDTO';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';

@injectable()
export default class CreatePlayerService {
  constructor(
    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, gameId }: ICreatePlayerDTO): Promise<IPlayer> {
    const [user, game] = await Promise.all([
      this.usersRepository.findOne(userId),
      this.gamesRepository.findOne(gameId),
    ]);

    if (!user || !game)
      throw new RequestError(
        'Could not create player',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const playerAlreadyExists = await this.playersRepository.findOne({
      userId,
      gameId,
    });

    if (playerAlreadyExists)
      throw new RequestError(
        'User is already playing this game',
        errorCodes.PLAYER_ALREADY_EXISTS,
      );

    const player = await this.playersRepository.create(
      new CreatePlayerAdapter({
        gameId,
        userId,
        gameRanks: game.ranks,
        gameLevels: game.levelInfo,
      }),
    );

    return player;
  }
}
