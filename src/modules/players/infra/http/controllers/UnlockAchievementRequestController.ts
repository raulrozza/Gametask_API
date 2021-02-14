import {
  CreateUnlockAchievementRequestService,
  ListUnlockAchievementRequestsService,
} from '@modules/players/services';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';

export default class UnlockAchievementRequestController {
  public index: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const listUnlockAchievementRequest = container.resolve(
      ListUnlockAchievementRequestsService,
    );

    const requests = await listUnlockAchievementRequest.execute(gameId);

    return response.json(requests);
  };

  public store: RequestHandler = async (request, response) => {
    const { achievement, requestDate, information } = request.body;
    const gameId = request.game;
    const { id } = request.auth;
    const { requester } = request.params;

    const createUnlockAchievementRequest = container.resolve(
      CreateUnlockAchievementRequestService,
    );

    const achievementRequest = await createUnlockAchievementRequest.execute({
      gameId,
      requester,
      achievement,
      requestDate,
      information,
      userId: id,
    });

    return response.status(201).json(achievementRequest);
  };
}
