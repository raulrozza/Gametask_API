import { container } from 'tsyringe';
import { RequestHandler } from 'express';

import { CreateTitleService } from '@modules/games/services';

export default class TitleController {
  public store: RequestHandler = async (request, response) => {
    const { name } = request.body;
    const gameId = request.game;

    const createTitle = container.resolve(CreateTitleService);

    const title = await createTitle.execute({ name, game: gameId });

    return response.status(201).json(title);
  };
}
