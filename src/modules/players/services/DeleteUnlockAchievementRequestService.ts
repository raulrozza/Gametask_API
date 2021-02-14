import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IUnlockAchievementRequestRepository } from '@modules/players/repositories';
import { IGamesRepository } from '@modules/games/repositories';
import IRequestExecutionDTO from '../dtos/IRequestExecutionDTO';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';

@injectable()
export default class DeleteUnlockAchievementRequestService {
  constructor(
    @inject('UnlockAchievementRequestRepository')
    private unlockAchievementRequestRepository: IUnlockAchievementRequestRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({
    gameId,
    requestId,
  }: IRequestExecutionDTO): Promise<void> {
    const game = await this.gamesRepository.findOne(gameId);
    if (!game)
      throw new RequestError(
        'Game does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const requestExists = await this.unlockAchievementRequestRepository.findOne(
      requestId,
    );
    if (!requestExists)
      throw new RequestError(
        'This request does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    await this.unlockAchievementRequestRepository.delete(requestId, gameId);

    await this.gamesRepository.update({
      id: gameId,
      administrators: game.administrators,
      description: game.description,
      levelInfo: game.levelInfo,
      name: game.name,
      ranks: game.ranks,
      image: game.image,
      newRegisters: Number(game.newRegisters) - 1,
      theme: game.theme,
    });
  }
}
