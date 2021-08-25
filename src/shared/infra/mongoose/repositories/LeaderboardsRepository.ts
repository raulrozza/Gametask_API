import errorCodes from '@config/errorCodes';
import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import UpdatePositionAdapter from '@shared/domain/adapters/UpdatePositionAdapter';
import { ILeaderboard } from '@shared/domain/entities';
import { ILeaderboardsRepository } from '@shared/domain/repositories';
import { RequestError } from '@shared/infra/errors';
import Leaderboard from '@shared/infra/mongoose/entities/Leaderboard';
import { ClientSession, isValidObjectId } from 'mongoose';

export default class LeaderboardsRepository implements ILeaderboardsRepository {
  public async create({
    game,
    createdAt,
    expiresAt,
  }: CreateLeaderboardAdapter): Promise<ILeaderboard> {
    return Leaderboard.create({
      game,
      createdAt,
      expiresAt,
    });
  }

  public async getGameCurrentRanking(
    gameId: string,
  ): Promise<ILeaderboard | undefined> {
    const leaderboard = await Leaderboard.findOne({ game: gameId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'position',
        populate: {
          path: 'player',
          select: 'level rank currentTitle user id',
          populate: [
            {
              path: 'user',
              select: 'id firstname lastname image profile_url',
            },
            {
              path: 'currentTitle',
            },
          ],
        },
      });

    return leaderboard || undefined;
  }

  public async createOrUpdatePosition(
    { leaderboardId, positions }: UpdatePositionAdapter,
    session?: ClientSession,
  ): Promise<ILeaderboard> {
    if (!isValidObjectId(leaderboardId))
      throw new RequestError(
        'This leaderboard does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    return Leaderboard.updateOne(
      {
        _id: leaderboardId,
      },
      {
        $set: {
          position: positions,
        },
      },
      {
        session,
      },
    );
  }
}
