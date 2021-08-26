import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@shared/domain/repositories';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import { ICompleteActivityRequestRepository } from '@modules/players/domain/repositories';
import IRequestExecutionDTO from '@modules/players/domain/dtos/IRequestExecutionDTO';

@injectable()
export default class DeleteCompleteActivityRequestService {
  constructor(
    @inject('CompleteActivityRequestRepository')
    private completeActivityRequestRepository: ICompleteActivityRequestRepository,

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

    const requestExists = await this.completeActivityRequestRepository.findOne(
      requestId,
    );
    if (!requestExists)
      throw new RequestError(
        'This request does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    await this.transactionProvider.startSession(async session => {
      await this.completeActivityRequestRepository.delete(
        requestId,
        gameId,
        session,
      );

      await this.gamesRepository.updateRegisters(game.id, -1, session);
    });
  }
}
