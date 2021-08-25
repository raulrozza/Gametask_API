import { ILeaderboard } from '@shared/domain/entities';

export default interface ILeaderboardsRepository<
  T extends ILeaderboard = ILeaderboard
> {
  create(leaderboard: Omit<ILeaderboard, 'id' | 'position'>): Promise<T>;
  getGameCurrentRanking(gameId: string): Promise<T | undefined>;
  /**
   * Creates a new position on the leaderboard, or updates an already positioned player's experience and ranking
   *
   * @param id
   * The leaderboard id
   *
   * @param playerId
   * Id of the player to be registered in the leaderboard, or the id of a player already positioned
   *
   * @param experience
   * The player's initial experience, or its increase in experience
   **/
  createOrUpdatePosition(
    id: string,
    playerId: string,
    experience: number,
    session?: object,
  ): Promise<T>;
}
