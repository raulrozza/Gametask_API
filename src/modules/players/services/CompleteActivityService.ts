import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IFeedPostsRepository,
  ICompleteActivityRequestRepository,
  IPlayersRepository,
} from '@modules/players/domain/repositories';

import {
  IActivitiesRepository,
  IGamesRepository,
} from '@modules/games/domain/repositories';
import ITransactionProvider from '@shared/domain/providers/ITransactionProvider';
import ICompleteActivityDTO from '@modules/players/domain/dtos/ICompleteActivityDTO';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import { IPlayer } from '@modules/players/domain/entities';
import { IGame, ILevelInfo, IRank } from '@shared/domain/entities';
import { ILeaderboardsRepository } from '@shared/domain/repositories';
import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import UpdatePositionAdapter from '@shared/domain/adapters/UpdatePositionAdapter';
import UpdatePlayerAdapter from '@modules/players/domain/adapters/UpdatePlayer';
import CreateFeedPostAdapter from '@modules/players/domain/adapters/CreateFeedPost';

interface IAddCompletionToActivityHistory {
  userId: string;
  activityId: string;
  completionDate: Date;
}

interface IFinishRequest {
  requestId: string;
  gameId: string;
}

interface IPostActivityCompletion {
  activityId: string;
  gameId: string;
  playerId: string;
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
      await this.addCompletionToActivityHistory(
        {
          userId,
          completionDate: request.completionDate,
          activityId: activity.id,
        },
        session,
      );

      await this.finishRequest({ requestId: request.id, gameId }, session);

      await this.postActivityCompletion(
        {
          activityId,
          gameId,
          playerId,
        },
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

  private async addCompletionToActivityHistory(
    { userId, activityId, completionDate }: IAddCompletionToActivityHistory,
    session: object,
  ): Promise<void> {
    const newHistory = {
      user: userId,
      log: completionDate,
    };
    await this.activitiesRepository.updateHistory(
      activityId,
      newHistory,
      session,
    );
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

    await this.gamesRepository.updateRegisters(gameId, -1, session);
  }

  private async postActivityCompletion(
    { activityId, gameId, playerId }: IPostActivityCompletion,
    session: object,
  ): Promise<void> {
    await this.feedPostsRepository.create(
      new CreateFeedPostAdapter({
        game: gameId,
        player: playerId,
        activity: activityId,
        type: 'activity',
      }),
      session,
    );
  }

  private async giveExperienceToPlayer(
    { gameId, playerId, userId, experience }: IGiveExperienceToPlayer,
    session: object,
  ): Promise<void> {
    const [player, game] = await Promise.all([
      this.playersRepository.findOne({ id: playerId }) as Promise<IPlayer>,
      this.gamesRepository.findOne(gameId) as Promise<IGame>,
    ]);

    player.experience += experience;

    const playerNextLevel = this.getNextLevel(
      game.levelInfo,
      player.experience,
    );

    if (!playerNextLevel || playerNextLevel.level <= player.level)
      return this.updatePlayer(player, session);

    player.level = playerNextLevel.level;
    await this.postNewLevel(
      { playerId, level: playerNextLevel, gameId },
      session,
    );

    const newRank = this.getNewRank(game.ranks, player.level);
    if (newRank) {
      player.rank = newRank;
      await this.postNewRank({ playerId, rank: newRank, gameId }, session);
    }

    return this.updatePlayer(player, session);
  }

  private getNextLevel(
    levelInfo: ILevelInfo[],
    playerCurrentExperience: number,
  ): ILevelInfo | undefined {
    const levelsSortedByHigherExperience = levelInfo.sort(
      (a, b) => b.requiredExperience - a.requiredExperience,
    );

    const nextObtainableLevel = levelsSortedByHigherExperience.find(
      level => level.requiredExperience <= playerCurrentExperience,
    );

    return nextObtainableLevel;
  }

  private getNewRank(
    gameRanks: IRank[],
    playerLevel: number,
  ): IRank | undefined {
    const obtainableRanks = gameRanks.filter(rank => rank.level <= playerLevel);
    const ranksSortedByHigherLevel = obtainableRanks.sort(
      (a, b) => b.level - a.level,
    );

    return ranksSortedByHigherLevel[0];
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

  private async updatePlayer(player: IPlayer, session: object): Promise<void> {
    await this.playersRepository.update(
      new UpdatePlayerAdapter({
        id: player.id,
        currentTitle: player.currentTitle?.id,
        rank: player.rank,
        experience: player.experience,
        level: player.level,
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
