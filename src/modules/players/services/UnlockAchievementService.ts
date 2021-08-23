import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import {
  IFeedPostsRepository,
  IPlayersRepository,
  IUnlockAchievementRequestRepository,
} from '@modules/players/repositories';
import {
  IAchievementsRepository,
  IGamesRepository,
} from '@modules/games/domain/repositories';
import IUnlockAchievementDTO from '../dtos/IUnlockAchievementDTO';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';

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

    const achievementTitle = await this.retrieveAchievementTitleId({
      achievementId,
      gameId,
    });

    await this.transactionProvider.startSession(async session => {
      await this.playersRepository.unlockAchievement(
        playerId,
        achievementId,
        achievementTitle,
        session,
      );

      await this.unlockAchievementRequestRepository.delete(
        requestId,
        gameId,
        session,
      );

      await this.gamesRepository.updateRegisters(gameId, -1, session);

      await this.feedPostsRepository.create({
        game: gameId,
        player: playerId,
        type: 'achievement',
        achievement: achievementId,
      });
    });
  }

  private async validateInput({
    userId,
    requestId,
    playerId,
    gameId,
  }: IValidateInput): Promise<void> {
    const player = await this.playersRepository.findOne(
      playerId,
      userId,
      gameId,
    );
    if (!player)
      throw new RequestError(
        'This player does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const request = await this.unlockAchievementRequestRepository.findOne(
      requestId,
    );
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

    const title = achievement.title;

    if (typeof title === 'string') return title;
    return title?.id;
  }
}
