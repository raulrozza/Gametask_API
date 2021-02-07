import { container } from 'tsyringe';
import { RequestHandler } from 'express';

import { CreateGameService, ListGamesService } from '@modules/games/services';

export default class GameController {
  public index: RequestHandler = async (request, response) => {
    const { id } = request.auth;

    const listGame = container.resolve(ListGamesService);

    const games = await listGame.execute(id);

    return response.json(games);
  };

  public store: RequestHandler = async (request, response) => {
    const { name, description } = request.body;
    const { id } = request.auth;

    const createGame = container.resolve(CreateGameService);

    const game = await createGame.execute({
      name,
      description,
      creatorId: id,
    });

    return response.status(201).json(game);
  };
}
