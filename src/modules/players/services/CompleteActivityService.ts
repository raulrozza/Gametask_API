import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  ICompleteActivityRequestRepository,
  IFeedPostsRepository,
  ILeaderboardsRepository,
  IPlayersRepository,
} from '@modules/players/repositories';
import {
  IActivitiesRepository,
  IGamesRepository,
} from '@modules/games/repositories';
import ITransactionProvider from '@shared/container/providers/TransactionProvider/models/ITransactionProvider';
import ICompleteActivityDTO from '@modules/players/dtos/ICompleteActivityDTO';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';
import { IActivity } from '@modules/games/entities';

@injectable()
export default class CompleteActivityService {
  constructor(
    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,

    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,

    @inject('FeedPostsRepository')
    private feedPostsRepository: IFeedPostsRepository,

    @inject('CompleteActivityRequestRepository')
    private completeActivityRequestRepository: ICompleteActivityRequestRepository,

    @inject('LeaderboardsRepository')
    private leaderboardsRepository: ILeaderboardsRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('TransactionProvider')
    private transactionProvider: ITransactionProvider,
  ) {}

  public async execute({
    requestId,
    userId,
  }: ICompleteActivityDTO): Promise<void> {
    const request = await this.completeActivityRequestRepository.findOne(
      requestId,
    );

    if (!request)
      throw new RequestError(
        'This request does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const activity = (await this.activitiesRepository.findOne(
      request.activity as string,
      request.game as string,
    )) as IActivity;

    const player = await this.playersRepository.findOne(
      request.requester as string,
      userId,
      request.game as string,
    );

    await this.transactionProvider.startSession(async session => {});
  }
}
