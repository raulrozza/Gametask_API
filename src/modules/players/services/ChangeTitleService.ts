import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IPlayer } from '@modules/players/entities';
import IChangeTitleDTO from '@modules/players/dtos/IChangeTitleDTO';
import { IPlayersRepository } from '@modules/players/repositories';
import { ITitlesRepository } from '@modules/games/domain/repositories';

@injectable()
export default class ChangeTitleService {
  constructor(
    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,

    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({
    gameId,
    userId,
    playerId,
    titleId,
  }: IChangeTitleDTO): Promise<IPlayer> {
    if (titleId) {
      const title = await this.titlesRepository.findOne(titleId, gameId);

      if (!title)
        throw new RequestError(
          'This title does not exist',
          errorCodes.RESOURCE_NOT_FOUND,
          404,
        );
    }

    const player = await this.playersRepository.findOne(
      playerId,
      userId,
      gameId,
    );
    if (!player)
      throw new RequestError(
        'This player does not exists',
        errorCodes.RESOURCE_NOT_FOUND,
        404,
      );

    const updatedPlayer = await this.playersRepository.update({
      id: player.id,
      achievements: player.achievements,
      experience: player.experience,
      game: player.game,
      level: player.level,
      titles: player.titles,
      user: player.user,
      rank: player.rank,
      currentTitle: titleId,
    });

    return updatedPlayer;
  }
}
