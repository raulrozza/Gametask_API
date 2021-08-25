import { ILeaderboardsRepository } from '@modules/games/domain/repositories';
import CreateLeaderboardAdapter from '@modules/games/domain/adapters/CreateLeaderboard';
import Leaderboard from '@modules/games/infra/mongoose/entities/Leaderboard';
import { ILeaderboard } from '@shared/domain/entities';

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
