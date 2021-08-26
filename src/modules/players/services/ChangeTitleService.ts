import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IPlayer } from '@modules/players/domain/entities';
import IChangeTitleDTO from '@modules/players/domain/dtos/IChangeTitleDTO';
import { IPlayersRepository } from '@modules/players/domain/repositories';
import { ITitlesRepository } from '@shared/domain/repositories';
import UpdatePlayerAdapter from '@modules/players/domain/adapters/UpdatePlayer';

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

    const player = await this.playersRepository.findOne({
      id: playerId,
      gameId,
      userId,
    });
    if (!player)
      throw new RequestError(
        'This player does not exists',
        errorCodes.RESOURCE_NOT_FOUND,
        404,
      );

    const playerHasTitle = player.titles.find(title => title.id === titleId);
    if (!playerHasTitle)
      throw new RequestError(
        'You dont have that title',
        errorCodes.BAD_REQUEST_ERROR,
        400,
      );

    const updatedPlayer = await this.playersRepository.update(
      new UpdatePlayerAdapter({
        id: player.id,
        experience: player.experience,
        level: player.level,
        rank: player.rank,
        currentTitle: titleId,
      }),
    );

    return updatedPlayer;
  }
}
