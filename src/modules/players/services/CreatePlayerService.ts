import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';

import { IGamesRepository } from '@modules/games/repositories';
import { IGame, ILevelInfo, IRank } from '@modules/games/entities';
import { IUsersRepository } from '@modules/users/repositories';
import { IPlayersRepository } from '@modules/players/repositories';
import { IPlayer } from '@modules/players/entities';
import ICreatePlayerDTO from '@modules/players/dtos/ICreatePlayerDTO';

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

    const playerAlreadyExists = await this.playersRepository.isThereAPlayerAssociatedWith(
      userId,
      gameId,
    );

    if (playerAlreadyExists)
      throw new RequestError(
        'User is already playing this game',
        errorCodes.PLAYER_ALREADY_EXISTS,
      );

    const [initialRank, initialLevel] = await this.getInitialRankAndLevel(game);

    const player = await this.playersRepository.create({
      experience: 0,
      level: initialLevel,
      rank: initialRank,
      achievements: [],
      game: gameId,
      user: userId,
      titles: [],
    });

    return player;
  }

  private async getInitialRankAndLevel(
    game: IGame,
  ): Promise<[IRank | undefined, number]> {
    const initialLevel = await this.getInitialLevel(game.levelInfo);
    const initialRank = await this.getInitialRank(game.ranks, initialLevel);

    return [initialRank, initialLevel];
  }

  private async getInitialLevel(levelInfo: ILevelInfo[]): Promise<number> {
    const sortedLevels = levelInfo.sort(
      (a, b) => a.requiredExperience - b.requiredExperience,
    );

    const firstLevel = sortedLevels[0];

    if (!firstLevel) return 0;

    return firstLevel.level;
  }

  private async getInitialRank(
    ranks: IRank[],
    initialLevel: number,
  ): Promise<IRank | undefined> {
    if (!ranks.length) return;

    const sortedRanks = ranks.sort((a, b) => a.level - b.level);

    for (let i = 0; i < sortedRanks.length; i++) {
      const actualRank = sortedRanks[i];

      if (actualRank.level <= initialLevel) return actualRank;
    }
  }
}
