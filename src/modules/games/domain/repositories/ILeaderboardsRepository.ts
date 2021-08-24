import CreateLeaderboardAdapter from '@modules/games/domain/adapters/CreateLeaderboard';
import { ILeaderboard } from '@modules/games/domain/entities';

export default interface ILeaderboardsRepository {
  create(leaderboard: CreateLeaderboardAdapter): Promise<ILeaderboard>;
}
