import errorCodes from '@config/errorCodes';
import { FakePlayer } from '@modules/players/domain/entities/fakes';
import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import UpdatePositionAdapter from '@shared/domain/adapters/UpdatePositionAdapter';
import { ILeaderboard } from '@shared/domain/entities';
import { FakeLeaderboard } from '@shared/domain/entities/fakes';
import { ILeaderboardsRepository } from '@shared/domain/repositories';
import { RequestError } from '@shared/infra/errors';

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

  public async getGameCurrentRanking(
    gameId: string,
  ): Promise<ILeaderboard | undefined> {
    return this.leaderboards.find(board => board.game === gameId);
  }

  public async createOrUpdatePosition({
    leaderboardId,
    positions,
  }: UpdatePositionAdapter): Promise<ILeaderboard> {
    const foundIndex = this.leaderboards.findIndex(
      board => board.id === leaderboardId,
    );

    if (foundIndex < 0)
      throw new RequestError(
        'Leaderboard not found',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundLeaderboard = this.leaderboards[foundIndex];

    foundLeaderboard.position = positions.map(position => {
      const existingPosition = foundLeaderboard.position.find(
        currentPosition => currentPosition.player.id === position.player,
      );

      if (existingPosition)
        return {
          player: existingPosition.player,
          experience: position.experience,
        };

      return {
        player: new FakePlayer({
          id: position.player,
        }),
        experience: position.experience,
      };
    });

    this.leaderboards[foundIndex] = foundLeaderboard;

    return foundLeaderboard;
  }
}
