import { ILeaderboardsRepository } from '@modules/games/domain/repositories';
import CreateLeaderboardAdapter from '@modules/games/domain/adapters/CreateLeaderboard';
import { ILeaderboard } from '@modules/games/domain/entities';
import { FakeLeaderboard } from '@modules/games/domain/entities/fakes';

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
