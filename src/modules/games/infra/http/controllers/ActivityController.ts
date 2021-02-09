import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import {
  CreateActivityService,
  ListActivitiesService,
} from '@modules/games/services';

export default class ActivityReport {
  public index: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const listActivities = container.resolve(ListActivitiesService);

    const activities = await listActivities.execute(gameId);

    return response.json(activities);
  };

  public store: RequestHandler = async (request, response) => {
    const { name, description, experience, dmRules } = request.body;
    const gameId = request.game;

    const createActivity = container.resolve(CreateActivityService);

    const activity = await createActivity.execute({
      gameId,
      name,
      experience,
      description,
      dmRules,
    });

    return response.status(201).json(activity);
  };
}
