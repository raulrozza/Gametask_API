import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import { IUnlockAchievementRequestRepository } from '@modules/players/domain/repositories';
import { IGamesRepository } from '@shared/domain/repositories';
import IRequestExecutionDTO from '@modules/players/domain/dtos/IRequestExecutionDTO';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';

const REGISTER_DECREASE_COUNT = -1;

@injectable()
export default class DeleteUnlockAchievementRequestService {
  constructor(
    @inject('UnlockAchievementRequestRepository')
    private unlockAchievementRequestRepository: IUnlockAchievementRequestRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('TransactionProvider')
    private transactionProvider: ITransactionProvider,
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
      { id: requestId },
    );
    if (!requestExists)
      throw new RequestError(
        'This request does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    return this.transactionProvider.startSession(async session => {
      await this.unlockAchievementRequestRepository.delete(
        requestId,
        gameId,
        session,
      );

      await this.gamesRepository.updateRegisters(
        game.id,
        REGISTER_DECREASE_COUNT,
        session,
      );
    });
  }
}
