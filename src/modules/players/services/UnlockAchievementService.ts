import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import {
  IFeedPostsRepository,
  IPlayersRepository,
  IUnlockAchievementRequestRepository,
} from '@modules/players/domain/repositories';

import {
  IAchievementsRepository,
  IGamesRepository,
} from '@shared/domain/repositories';

import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import IUnlockAchievementDTO from '@modules/players/domain/dtos/IUnlockAchievementDTO';
import AddAchievementToPlayerAdapter from '@modules/players/domain/adapters/AddAchievementToPlayer';
import CreateFeedPostAdapter from '@modules/players/domain/adapters/CreateFeedPost';

const REGISTER_DECREASE_COUNT = -1;

interface IValidateInput {
  userId: string;
  requestId: string;
  playerId: string;
  gameId: string;
}

interface IRetrieveAchievementTitleId {
  achievementId: string;
  gameId: string;
}

@injectable()
export default class UnlockAchievementService {
  constructor(
    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,

    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,

    @inject('UnlockAchievementRequestRepository')
    private unlockAchievementRequestRepository: IUnlockAchievementRequestRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('FeedPostsRepository')
    private feedPostsRepository: IFeedPostsRepository,

    @inject('TransactionProvider')
    private transactionProvider: ITransactionProvider,
  ) {}

  public async execute({
    userId,
    requestId,
    playerId,
    gameId,
    achievementId,
  }: IUnlockAchievementDTO): Promise<void> {
    await this.validateInput({
      userId,
      requestId,
      playerId,
      gameId,
    });

    const achievementTitleId = await this.retrieveAchievementTitleId({
      achievementId,
      gameId,
    });

    return this.transactionProvider.startSession(async session => {
      await this.playersRepository.addAchievement(
        new AddAchievementToPlayerAdapter({
          id: playerId,
          achievement: achievementId,
          title: achievementTitleId,
        }),
        session,
      );

      await this.unlockAchievementRequestRepository.delete(
        requestId,
        gameId,
        session,
      );

      await this.gamesRepository.updateRegisters(
        gameId,
        REGISTER_DECREASE_COUNT,
        session,
      );

      await this.feedPostsRepository.create(
        new CreateFeedPostAdapter({
          game: gameId,
          player: playerId,
          type: 'achievement',
          achievement: achievementId,
        }),
      );
    });
  }

  private async validateInput({
    userId,
    requestId,
    playerId,
    gameId,
  }: IValidateInput): Promise<void> {
    const player = await this.playersRepository.findOne({
      id: playerId,
      userId,
      gameId,
    });
    if (!player)
      throw new RequestError(
        'This player does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const request = await this.unlockAchievementRequestRepository.findOne({
      id: requestId,
    });
    if (!request)
      throw new RequestError(
        'You should first request this achievement to be unlocked',
        errorCodes.BAD_REQUEST_ERROR,
      );
  }

  private async retrieveAchievementTitleId({
    achievementId,
    gameId,
  }: IRetrieveAchievementTitleId): Promise<string | undefined> {
    const achievement = await this.achievementsRepository.findOne(
      achievementId,
      gameId,
    );
    if (!achievement)
      throw new RequestError(
        'This achievement does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    return achievement.title?.id;
  }
}
