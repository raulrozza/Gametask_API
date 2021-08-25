import { v4 as uuid } from 'uuid';

import { ILeaderboardsRepository } from '..';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import { ILeaderboard } from '@shared/domain/entities';

export default class FakeLeaderboardsRepository
  implements ILeaderboardsRepository {
  private leaderboards: ILeaderboard[] = [];

  public async create(
    leaderboard: Omit<ILeaderboard, 'id'>,
  ): Promise<ILeaderboard> {
    const id = uuid();

    const newLeaderboard = {
      ...leaderboard,
      id,
    };

    this.leaderboards.push(newLeaderboard);

    return newLeaderboard;
  }

  public async getGameCurrentRanking(
    gameId: string,
  ): Promise<ILeaderboard | undefined> {
    return this.leaderboards.find(board => board.game === gameId);
  }

  public async createOrUpdatePosition(
    id: string,
    playerId: string,
    experience: number,
  ): Promise<ILeaderboard> {
    const foundIndex = this.leaderboards.findIndex(board => board.id === id);

    if (foundIndex < 0)
      throw new RequestError(
        'Leaderboard not found',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundLeaderboard = this.leaderboards[foundIndex];

    const playerPositionIndex = foundLeaderboard.position.findIndex(
      position => position.player === playerId,
    );

    if (playerPositionIndex < 0) {
      foundLeaderboard.position.push({
        player: playerId,
        experience,
      });

      this.leaderboards[foundIndex] = foundLeaderboard;

      return foundLeaderboard;
    }

    const playerPosition = foundLeaderboard.position[playerPositionIndex];
    playerPosition.experience += experience;
    foundLeaderboard.position[playerPositionIndex] = playerPosition;

    this.leaderboards[foundIndex] = foundLeaderboard;

    return foundLeaderboard;
  }
}
