import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { ICompleteActivityRequestRepository } from '@modules/players/repositories';
import { IGamesRepository } from '@modules/games/repositories';
import IRequestExecutionDTO from '../dtos/IRequestExecutionDTO';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';

@injectable()
export default class DeleteCompleteActivityRequestService {
  constructor(
    @inject('CompleteActivityRequestRepository')
    private completeActivityRequestRepository: ICompleteActivityRequestRepository,

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

    const requestExists = await this.completeActivityRequestRepository.findOne(
      requestId,
    );
    if (!requestExists)
      throw new RequestError(
        'This request does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    await this.completeActivityRequestRepository.delete(requestId, gameId);

    await this.gamesRepository.updateRegisters(game.id, -1);
  }
}
