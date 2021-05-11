import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import {
  CreateAchievementService,
  DeleteAchievementService,
  ListAchievementsService,
  ShowAchievementService,
  UpdateAchievementService,
} from '@modules/games/services';

export default class AchievementController {
  public index: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const listAchievements = container.resolve(ListAchievementsService);

    const achievements = await listAchievements.execute(gameId);

    return response.json(achievements);
  };

  public remove: RequestHandler = async (request, response) => {
    const gameId = request.game;
    const { id } = request.params;

    const deleteAchievement = container.resolve(DeleteAchievementService);

    await deleteAchievement.execute({ id, gameId });

    return response.status(201).end();
  };

  public show: RequestHandler = async (request, response) => {
    const gameId = request.game;
    const { id } = request.params;

    const showAchievement = container.resolve(ShowAchievementService);

    const achievement = await showAchievement.execute({
      gameId,
      achievementId: id,
    });

    return response.json(achievement);
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

  public update: RequestHandler = async (request, response) => {
    const { name, description, title } = request.body;
    const { id } = request.params;
    const gameId = request.game;

    const updateAchievement = container.resolve(UpdateAchievementService);

    const achievement = await updateAchievement.execute({
      gameId,
      id,
      name,
      title,
      description,
    });

    return response.status(201).json(achievement);
  };
}
