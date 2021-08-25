import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import { ILeaderboard } from '@shared/domain/entities';
import { ILeaderboardsRepository } from '@shared/domain/repositories';
import Leaderboard from '@shared/infra/mongoose/entities/Leaderboard';

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
