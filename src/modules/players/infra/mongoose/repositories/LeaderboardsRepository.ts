import { ILeaderboardsRepository } from '@modules/players/repositories';
import Leaderboard, {
  ILeaderboardDocument,
} from '@modules/players/infra/mongoose/entities/Leaderboard';
import { ILeaderboard } from '@modules/players/entities';
import { ClientSession, isValidObjectId } from 'mongoose';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';

export default class LeaderboardsRepository
  implements ILeaderboardsRepository<ILeaderboardDocument> {
  public async create({
    game,
    createdAt,
    expiresAt,
  }: Omit<ILeaderboard, 'id'>): Promise<ILeaderboardDocument> {
    return await Leaderboard.create({
      game,
      createdAt,
      expiresAt,
    });
  }

  public async getGameCurrentRanking(
    gameId: string,
  ): Promise<ILeaderboardDocument | undefined> {
    return await Leaderboard.findOne({ game: gameId }).populate({
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
  }

  public async createOrUpdatePosition(
    id: string,
    playerId: string,
    experience: number,
    session?: ClientSession,
  ): Promise<ILeaderboardDocument> {
    if (!isValidObjectId(id))
      throw new RequestError(
        'This leaderboard does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    return await Leaderboard.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          'position.$[player]': {
            player: playerId,
            experience,
          },
        },
      },
      {
        new: true,
        upsert: true,
        arrayFilters: [
          {
            player: playerId,
          },
        ],
        session,
      },
    );
  }
}
