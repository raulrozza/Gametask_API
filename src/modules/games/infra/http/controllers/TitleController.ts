import { container } from 'tsyringe';
import { RequestHandler } from 'express';

import errorCodes from '@config/errorCodes';
import {
  CreateTitleService,
  ListTitlesService,
  UpdateTitleService,
} from '@modules/games/services';
import { RequestError } from '@shared/errors/implementations';

export default class TitleController {
  public index: RequestHandler = async (request, response) => {
    const gameId = request.game;
    const { name } = request.query;

    const listTitles = container.resolve(ListTitlesService);

    const titles =
      name && typeof name === 'string'
        ? await listTitles.execute({ gameId, name })
        : await listTitles.execute({ gameId });

    return response.json(titles);
  };

  public store: RequestHandler = async (request, response) => {
    const { name } = request.body;
    const gameId = request.game;

    const createTitle = container.resolve(CreateTitleService);

    const title = await createTitle.execute({ name, game: gameId });

    return response.status(201).json(title);
  };

  public update: RequestHandler = async (request, response) => {
    const { name } = request.body;
    const gameId = request.game;
    const { id } = request.params;
    if (!id)
      throw new RequestError(
        'Missing id in params',
        errorCodes.MISSING_PARAMETERS,
      );

    const updateTitle = container.resolve(UpdateTitleService);

    const title = await updateTitle.execute({ id, name, gameId });

    return response.status(201).json(title);
  };
}
