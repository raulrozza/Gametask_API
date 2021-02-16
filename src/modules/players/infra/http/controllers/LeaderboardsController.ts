import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { ShowCurrentLeaderboardService } from '@modules/players/services';

export default class LeaderboardsService {
  public show: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const showCurrentLeaderboard = container.resolve(
      ShowCurrentLeaderboardService,
    );

    const leaderboard = await showCurrentLeaderboard.execute(gameId);

    return response.json(leaderboard);
  };
}
