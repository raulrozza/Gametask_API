import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { ILeaderboard } from '@shared/domain/entities';
import { ILeaderboardsRepository } from '@shared/domain/repositories';

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
