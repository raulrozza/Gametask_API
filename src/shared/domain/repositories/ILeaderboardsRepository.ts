import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import UpdatePositionAdapter from '@shared/domain/adapters/UpdatePositionAdapter';
import { ILeaderboard } from '@shared/domain/entities';

export default interface ILeaderboardsRepository {
  create(leaderboard: CreateLeaderboardAdapter): Promise<ILeaderboard>;
  getGameCurrentRanking(gameId: string): Promise<ILeaderboard | undefined>;
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
    updatedPositions: UpdatePositionAdapter,
    session?: object,
  ): Promise<ILeaderboard>;
}
