import { container } from 'tsyringe';
import { RequestHandler } from 'express';

import {
  CreateGameService,
  ListGamesService,
  ShowGameService,
  UpdateGameService,
} from '@modules/games/services';

export default class GameController {
  public index: RequestHandler = async (request, response) => {
    const { id } = request.auth;

    const listGame = container.resolve(ListGamesService);

    const games = await listGame.execute(id);

    return response.json(games);
  };

  public show: RequestHandler = async (request, response) => {
    const { id } = request.auth;
    const gameId = request.game;

    const showGame = container.resolve(ShowGameService);

    const game = await showGame.execute({
      gameId,
      userId: id,
    });

    return response.json(game);
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

  public update: RequestHandler = async (request, response) => {
    const { name, description, ranks, levelInfo, theme } = request.body;
    const { id } = request.auth;
    const gameId = request.game;

    const updateGame = container.resolve(UpdateGameService);

    const game = await updateGame.execute({
      adminId: id,
      id: gameId,
      name,
      description,
      theme,
      levelInfo,
      ranks,
    });

    return response.status(201).json(game);
  };
}
