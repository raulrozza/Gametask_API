import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import { ILeaderboard } from '@shared/domain/entities';
import { FakeLeaderboard } from '@shared/domain/entities/fakes';
import { ILeaderboardsRepository } from '@shared/domain/repositories';

export default class FakeLeaderboardsRepository
  implements ILeaderboardsRepository {
  private leaderboards: ILeaderboard[] = [];

  public getLeaderboards(): ILeaderboard[] {
    return this.leaderboards;
  }

  public async create({
    game,
  }: CreateLeaderboardAdapter): Promise<ILeaderboard> {
    const leaderboard = new FakeLeaderboard({ game });

    this.leaderboards.push(leaderboard);

    return leaderboard;
  }
}
