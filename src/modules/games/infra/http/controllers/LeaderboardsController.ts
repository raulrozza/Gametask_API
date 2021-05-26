import { container } from 'tsyringe';
import { RequestHandler } from 'express';

import { ResetLeaderboardsService } from '@modules/games/services';

export default class LeaderboardsController {
  public store: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const resetLeaderboard = container.resolve(ResetLeaderboardsService);

    await resetLeaderboard.execute(gameId);

    return response.status(201).end();
  };
}
