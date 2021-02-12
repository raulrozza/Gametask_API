import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import { ChangeTitleService } from '@modules/players/services';

export default class PlayerTitlesController {
  public update: RequestHandler = async (request, response) => {
    const { titleId } = request.body;
    const { id: userId } = request.auth;
    const gameId = request.game;
    const { id: playerId } = request.params;

    const changeTitle = container.resolve(ChangeTitleService);

    const player = await changeTitle.execute({
      titleId,
      userId,
      gameId,
      playerId,
    });

    return response.status(201).json(player);
  };
}
