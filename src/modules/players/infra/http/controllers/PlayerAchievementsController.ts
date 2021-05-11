import { container } from 'tsyringe';
import { RequestHandler } from 'express';
import { UnlockAchievementService } from '@modules/players/services';

export default class PlayerAchievementsController {
  public update: RequestHandler = async (request, response) => {
    const { userId, achievementId, requestId } = request.body;
    const gameId = request.game;
    const { id: playerId } = request.params;

    const unlockAchievement = container.resolve(UnlockAchievementService);

    await unlockAchievement.execute({
      userId,
      playerId,
      gameId,
      achievementId,
      requestId,
    });

    return response.status(201).end();
  };
}
