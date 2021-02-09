import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import { CreateAchievementService } from '@modules/games/services';

export default class AchievementController {
  public store: RequestHandler = async (request, response) => {
    const { name, description, title } = request.body;
    const gameId = request.game;

    const createAchievement = container.resolve(CreateAchievementService);

    const achievement = await createAchievement.execute({
      gameId,
      name,
      description,
      title,
    });

    return response.status(201).json(achievement);
  };
}
