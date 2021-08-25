import { ILeaderboardsRepository } from '@modules/players/repositories';
import { ClientSession, isValidObjectId } from 'mongoose';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import Leaderboard, {
  ILeaderboardDocument,
} from '@modules/games/infra/mongoose/entities/Leaderboard';
import { ILeaderboard } from '@shared/domain/entities';

export default class LeaderboardsRepository
  implements ILeaderboardsRepository<ILeaderboardDocument> {
  public async create({
    game,
    createdAt,
    expiresAt,
  }: Omit<ILeaderboard, 'id' | 'position'>): Promise<ILeaderboardDocument> {
    return await Leaderboard.create({
      game,
      createdAt,
      expiresAt,
    });
  }

  public async getGameCurrentRanking(
    gameId: string,
  ): Promise<ILeaderboardDocument | undefined> {
    return await Leaderboard.findOne({ game: gameId })
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

    const leaderboard = (await Leaderboard.findById(
      id,
    )) as ILeaderboardDocument;

    const positions = [...leaderboard.position];

    const playerIndex = positions.findIndex(
      position => String(position.player) === String(playerId),
    );

    if (playerIndex < 0) {
      positions.push({ player: playerId, experience });

      return Leaderboard.updateOne(
        {
          _id: id,
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

    positions[playerIndex].experience += experience;

    return await Leaderboard.updateOne(
      {
        _id: id,
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
