import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';

import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import { ILeaderboardsRepository } from '@shared/domain/repositories';

@injectable()
export default class ResetLeaderboardsService {
  constructor(
    @inject('LeaderboardsRepository')
    private leaderboardsRepository: ILeaderboardsRepository,
  ) {}

  public async execute(gameId: string): Promise<void> {
    try {
      await this.leaderboardsRepository.create(
        new CreateLeaderboardAdapter({ game: gameId }),
      );
    } catch (error) {
      if (error instanceof RequestError) throw error;

      throw new RequestError(
        error.message,
        errorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
    }
  }
}
