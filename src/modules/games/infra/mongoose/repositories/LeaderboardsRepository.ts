import { ILeaderboardsRepository } from '@modules/games/domain/repositories';
import CreateLeaderboardAdapter from '@modules/games/domain/adapters/CreateLeaderboard';
import { ILeaderboard } from '@modules/games/domain/entities';
import Leaderboard from '@modules/games/infra/mongoose/entities/Leaderboard';

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
}
