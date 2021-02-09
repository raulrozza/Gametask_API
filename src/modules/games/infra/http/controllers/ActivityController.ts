import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';
import {
  CreateActivityService,
  ListActivitiesService,
  ShowActivityService,
} from '@modules/games/services';

export default class ActivityReport {
  public index: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const listActivities = container.resolve(ListActivitiesService);

    const activities = await listActivities.execute(gameId);

    return response.json(activities);
  };

  public show: RequestHandler = async (request, response) => {
    const { id } = request.params;
    const gameId = request.game;

    if (!id)
      throw new RequestError(
        'Missing activity id on params.',
        errorCodes.MISSING_PARAMETERS,
      );

    const showActivity = container.resolve(ShowActivityService);

    const activity = await showActivity.execute({ gameId, activityId: id });

    return response.json(activity);
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
