import { v4 as uuid } from 'uuid';

import { ILeaderboard } from '@modules/players/entities';
import { ILeaderboardsRepository } from '..';

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
}
