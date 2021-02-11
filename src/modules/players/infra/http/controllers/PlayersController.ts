import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import {
  CreatePlayerService,
  ListPlayersService,
} from '@modules/players/services';

export default class PlayersController {
  public index: RequestHandler = async (request, response) => {
    const { id } = request.auth;

    const listPlayers = container.resolve(ListPlayersService);

    const players = await listPlayers.execute(id);

    return response.json(players);
  };

  public store: RequestHandler = async (request, response) => {
    const { id } = request.auth;
    const gameId = request.game;

    const createPlayer = container.resolve(CreatePlayerService);

    const player = await createPlayer.execute({ gameId, userId: id });

    return response.status(201).json(player);
  };
}
