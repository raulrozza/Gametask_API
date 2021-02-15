import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { CreateCompleteActivityRequestService } from '@modules/players/services';

export default class CompleteActivityRequestController {
  public store: RequestHandler = async (request, response) => {
    const { activity, completionDate, information, requestDate } = request.body;
    const { requester } = request.params;
    const { id: userId } = request.auth;
    const gameId = request.game;

    const createCompleteActivityRequest = container.resolve(
      CreateCompleteActivityRequestService,
    );

    const activityRequest = await createCompleteActivityRequest.execute({
      requester,
      userId,
      gameId,
      activity,
      completionDate,
      information,
      requestDate,
    });

    return response.status(201).json(activityRequest);
  };
}
