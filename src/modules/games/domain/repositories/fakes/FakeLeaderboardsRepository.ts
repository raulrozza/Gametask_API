import { v4 as uuid } from 'uuid';

import { ILeaderboard } from '@modules/players/entities';
import { ILeaderboardsRepository } from '@modules/games/domain/repositories';

export default class FakeLeaderboardsRepository
  implements ILeaderboardsRepository {
  private leaderboards: ILeaderboard[] = [];

  public getLeaderboards(): ILeaderboard[] {
    return this.leaderboards;
  }

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
