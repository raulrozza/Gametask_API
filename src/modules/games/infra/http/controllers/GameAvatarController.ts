import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { UpdateGameAvatarService } from '@modules/games/services';

export default class GameAvatarController {
  public update: RequestHandler = async (request, response) => {
    const file = request.file;
    const id = request.game;

    const updateGameAvatar = container.resolve(UpdateGameAvatarService);

    const updatedGame = await updateGameAvatar.execute({
      filename: file.filename,
      id,
    });

    return response.status(201).json(updatedGame);
  };
}
