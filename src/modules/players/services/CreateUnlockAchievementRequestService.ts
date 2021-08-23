import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import {
  IAchievementsRepository,
  IGamesRepository,
} from '@modules/games/domain/repositories';
import ICreateUnlockAchievementRequestDTO from '@modules/players/dtos/ICreateUnlockAchievementRequestDTO';
import { IUnlockAchievementRequest } from '@modules/players/entities';
import {
  IPlayersRepository,
  IUnlockAchievementRequestRepository,
} from '@modules/players/repositories';

interface ValidadeInputParams {
  gameId: string;
  userId: string;
  requester: string;
  achievement: string;
}

@injectable()
export default class CreateUnlockAchievementRequestService {
  constructor(
    @inject('UnlockAchievementRequestRepository')
    private unlockAchievementRequestRepository: IUnlockAchievementRequestRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,

    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,

    @inject('TransactionProvider')
    private transactionProvider: ITransactionProvider,
  ) {}

  public async execute({
    userId,
    gameId,
    requester,
    achievement,
    requestDate,
    information,
  }: ICreateUnlockAchievementRequestDTO): Promise<IUnlockAchievementRequest> {
    await this.validateInput({
      userId,
      gameId,
      requester,
      achievement,
    });

    return await this.transactionProvider.startSession<IUnlockAchievementRequest>(
      async session => {
        const request = await this.unlockAchievementRequestRepository.create(
          {
            achievement,
            game: gameId,
            requestDate,
            information,
            requester,
          },
          session,
        );

        await this.gamesRepository.updateRegisters(gameId, 1, session);

        return request;
      },
    );
  }

  private async validateInput({
    userId,
    gameId,
    requester,
    achievement,
  }: ValidadeInputParams): Promise<void> {
    const game = await this.gamesRepository.findOne(gameId);
    if (!game)
      throw new RequestError(
        'Game not found',
        errorCodes.BAD_REQUEST_ERROR,
        404,
      );

    const player = await this.playersRepository.findOne(
      requester,
      userId,
      gameId,
    );
    if (!player)
      throw new RequestError(
        'This player does not exist',
        errorCodes.BAD_REQUEST_ERROR,
        404,
      );

    const foundAchievement = await this.achievementsRepository.findOne(
      achievement,
      gameId,
    );
    if (!foundAchievement)
      throw new RequestError(
        'This achievement does not exist',
        errorCodes.BAD_REQUEST_ERROR,
        404,
      );

    const alreadyRequested = await this.unlockAchievementRequestRepository.checkIfRequested(
      requester,
      gameId,
      achievement,
    );
    if (alreadyRequested)
      throw new RequestError(
        'This achievement was already requested',
        errorCodes.ACHIEVEMENT_REGISTER_ALREADY_EXISTS,
      );

    if ((player.achievements as string[]).includes(achievement))
      throw new RequestError(
        'This player already has this achievement',
        errorCodes.ACHIEVEMENT_BELONGS_TO_PLAYER,
      );
  }
}
