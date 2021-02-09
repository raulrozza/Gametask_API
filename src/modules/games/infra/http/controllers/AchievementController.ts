import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import {
  CreateAchievementService,
  ListAchievementsService,
} from '@modules/games/services';

export default class AchievementController {
  public index: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const listAchievements = container.resolve(ListAchievementsService);

    const achievements = await listAchievements.execute(gameId);

    return response.json(achievements);
  };

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
