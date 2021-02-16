import {
  CreateUnlockAchievementRequestService,
  DeleteUnlockAchievementRequestService,
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

  public remove: RequestHandler = async (request, response) => {
    const gameId = request.game;
    const { id } = request.params;

    const deleteUnlockAchievementRequest = container.resolve(
      DeleteUnlockAchievementRequestService,
    );

    await deleteUnlockAchievementRequest.execute({ requestId: id, gameId });

    return response.status(201).end();
  };

  public store: RequestHandler = async (request, response) => {
    const { achievement, requestDate, information } = request.body;
    const gameId = request.game;
    const { id } = request.auth;
    const { id: requester } = request.params;

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
