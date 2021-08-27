import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import {
  IGamesRepository,
  IAchievementsRepository,
} from '@shared/domain/repositories';

import ICreateUnlockAchievementRequestDTO from '@modules/players/domain/dtos/ICreateUnlockAchievementRequestDTO';
import {
  IUnlockAchievementRequestRepository,
  IPlayersRepository,
} from '@modules/players/domain/repositories';

import { IUnlockAchievementRequest } from '@modules/players/domain/entities';
import CreateUnlockAchievementAdapter from '@modules/players/domain/adapters/CreateUnlockAchievement';

interface ValidadeInputParams {
  gameId: string;
  userId: string;
  requester: string;
  achievement: string;
}

const GAME_REGISTERS_INCREASE_COUNT = 1;

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

    return this.transactionProvider.startSession<IUnlockAchievementRequest>(
      async session => {
        const request = await this.unlockAchievementRequestRepository.create(
          new CreateUnlockAchievementAdapter({
            achievement,
            game: gameId,
            requestDate,
            information,
            requester,
          }),
          session,
        );

        await this.gamesRepository.updateRegisters(
          gameId,
          GAME_REGISTERS_INCREASE_COUNT,
          session,
        );

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

    const player = await this.playersRepository.findOne({
      id: requester,
      userId,
      gameId,
    });
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

    const alreadyRequested = await this.unlockAchievementRequestRepository.findOne(
      { requester, gameId, achievementId: achievement },
    );
    if (alreadyRequested)
      throw new RequestError(
        'This achievement was already requested',
        errorCodes.ACHIEVEMENT_REGISTER_ALREADY_EXISTS,
      );

    if (
      player.achievements.find(
        playerAchievement => playerAchievement.id === achievement,
      )
    )
      throw new RequestError(
        'This player already has this achievement',
        errorCodes.ACHIEVEMENT_BELONGS_TO_PLAYER,
      );
  }
}
