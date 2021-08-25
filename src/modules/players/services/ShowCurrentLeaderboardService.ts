import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { ILeaderboardsRepository } from '@modules/players/repositories';
import { ILeaderboard } from '@shared/domain/entities';

@injectable()
export default class ShowCurrentLeaderboardService {
  constructor(
    @inject('LeaderboardsRepository')
    private leaderboardsRepository: ILeaderboardsRepository,
  ) {}

  public async execute(gameId: string): Promise<ILeaderboard | undefined> {
    return this.leaderboardsRepository.getGameCurrentRanking(gameId);
  }
}
