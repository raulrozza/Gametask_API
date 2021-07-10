import { ILeaderboard } from '@modules/players/entities';

export default interface ILeaderboardsRepository<
  T extends ILeaderboard = ILeaderboard
> {
  create(leaderboard: Omit<ILeaderboard, 'id' | 'position'>): Promise<T>;
}
