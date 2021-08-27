import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IFeedPostsRepository,
  ICompleteActivityRequestRepository,
  IPlayersRepository,
} from '@modules/players/domain/repositories';
import {
  IGamesRepository,
  IActivitiesRepository,
  ILeaderboardsRepository,
} from '@shared/domain/repositories';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import ICompleteActivityDTO from '@modules/players/domain/dtos/ICompleteActivityDTO';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import { ILevelInfo, IRank } from '@shared/domain/entities';

import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import UpdatePositionAdapter from '@shared/domain/adapters/UpdatePositionAdapter';
import UpdatePlayerAdapter from '@modules/players/domain/adapters/UpdatePlayer';
import CreateFeedPostAdapter from '@modules/players/domain/adapters/CreateFeedPost';
import ActivityHistoryAdapter from '@shared/domain/adapters/ActivityHistory';
import PlayerLevelUp from '@modules/players/domain/rules/PlayerLevelUp';

interface IFinishRequest {
  requestId: string;
  gameId: string;
}

interface IGiveExperienceToPlayer {
  playerId: string;
  userId: string;
  gameId: string;
  experience: number;
}

interface IPostNewLevel {
  playerId: string;
  level: ILevelInfo;
  gameId: string;
}

interface IPostNewRank {
  playerId: string;
  rank: IRank;
  gameId: string;
}

interface IPositionPlayerOnLeaderboard {
  gameId: string;
  playerId: string;
  experience: number;
}

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

    if (!request) {
      throw new RequestError(
        'This request does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );
    }

    const activityId = request.activity.id;
    const gameId = request.game;
    const playerId = request.requester.id;

    const activity = await this.activitiesRepository.findOne(
      activityId,
      gameId,
    );

    if (!activity)
      throw new RequestError(
        'The activity does not exist',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    await this.transactionProvider.startSession(async session => {
      await this.activitiesRepository.updateHistory(
        activityId,
        new ActivityHistoryAdapter({
          log: request.completionDate,
          user: userId,
        }),
        session,
      );

      await this.finishRequest({ requestId: request.id, gameId }, session);

      await this.feedPostsRepository.create(
        new CreateFeedPostAdapter({
          game: gameId,
          player: playerId,
          activity: activityId,
          type: 'activity',
        }),
        session,
      );

      await this.giveExperienceToPlayer(
        {
          gameId,
          playerId,
          userId,
          experience: activity.experience,
        },
        session,
      );

      await this.positionPlayerOnLeaderboard(
        { gameId, playerId, experience: activity.experience },
        session,
      );
    });
  }

  private async finishRequest(
    { requestId, gameId }: IFinishRequest,
    session: object,
  ): Promise<void> {
    await this.completeActivityRequestRepository.delete(
      requestId,
      gameId,
      session,
    );

    const REGISTER_DECREASE_COUNT = -1;

    await this.gamesRepository.updateRegisters(
      gameId,
      REGISTER_DECREASE_COUNT,
      session,
    );
  }

  private async giveExperienceToPlayer(
    { gameId, playerId, experience }: IGiveExperienceToPlayer,
    session: object,
  ): Promise<void> {
    const [player, game] = await Promise.all([
      this.playersRepository.findOne({ id: playerId }),
      this.gamesRepository.findOne(gameId),
    ]);

    if (!player || !game)
      throw new RequestError('Bad request', errorCodes.BAD_REQUEST_ERROR);

    const leveledPlayer = new PlayerLevelUp({
      player,
      game,
      activity: { experience },
    });

    if (leveledPlayer.hasLeveledUp)
      await this.postNewLevel(
        { playerId, level: leveledPlayer.nextLevel!, gameId },
        session,
      );

    if (leveledPlayer.gotNewRank)
      await this.postNewRank(
        { playerId, rank: leveledPlayer.rank!, gameId },
        session,
      );

    await this.playersRepository.update(
      new UpdatePlayerAdapter({
        id: player.id,
        currentTitle: player.currentTitle?.id,
        rank: leveledPlayer.rank,
        experience: leveledPlayer.experience,
        level: leveledPlayer.level,
      }),
      session,
    );
  }

  private async postNewLevel(
    { playerId, level, gameId }: IPostNewLevel,
    session: object,
  ): Promise<void> {
    await this.feedPostsRepository.create(
      new CreateFeedPostAdapter({
        player: playerId,
        type: 'level',
        level,
        game: gameId,
      }),
      session,
    );
  }

  private async postNewRank(
    { playerId, rank, gameId }: IPostNewRank,
    session: object,
  ): Promise<void> {
    await this.feedPostsRepository.create(
      new CreateFeedPostAdapter({
        player: playerId,
        type: 'rank',
        rank,
        game: gameId,
      }),
      session,
    );
  }

  private async positionPlayerOnLeaderboard(
    { gameId, playerId, experience }: IPositionPlayerOnLeaderboard,
    session: object,
  ): Promise<void> {
    let leaderboard = await this.leaderboardsRepository.getGameCurrentRanking(
      gameId,
    );

    if (!leaderboard)
      leaderboard = await this.leaderboardsRepository.create(
        new CreateLeaderboardAdapter({ game: gameId }),
      );

    await this.leaderboardsRepository.createOrUpdatePosition(
      new UpdatePositionAdapter({
        leaderboardId: leaderboard.id,
        currentPositions: leaderboard.position,
        newPosition: {
          player: playerId,
          experience,
        },
      }),
      session,
    );
  }
}
