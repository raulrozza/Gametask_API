import { ILeaderboardsRepository } from '@modules/games/repositories';
import Leaderboard, {
  ILeaderboardDocument,
} from '@modules/players/infra/mongoose/entities/Leaderboard';
import { ILeaderboard } from '@modules/players/entities';

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
}
