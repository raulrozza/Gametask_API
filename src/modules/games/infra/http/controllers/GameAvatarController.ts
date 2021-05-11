import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { UpdateGameAvatarService } from '@modules/games/services';

export default class GameAvatarController {
  public update: RequestHandler = async (request, response) => {
    const file = request.file;
    const gameId = request.game;
    const { id } = request.auth;

    const updateGameAvatar = container.resolve(UpdateGameAvatarService);

    const updatedGame = await updateGameAvatar.execute({
      filename: file.filename,
      id: gameId,
      userId: id,
    });

    return response.status(201).json(updatedGame);
  };
}
