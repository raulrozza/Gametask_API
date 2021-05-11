import { container } from 'tsyringe';
import { RequestHandler } from 'express';
import { CompleteActivityService } from '@modules/players/services';

export default class PlayerActivitiesController {
  public update: RequestHandler = async (request, response) => {
    const { userId } = request.body;
    const { id: requestId } = request.params;

    const completeActivity = container.resolve(CompleteActivityService);

    await completeActivity.execute({
      userId,
      requestId,
    });

    return response.status(201).end();
  };
}
