import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { UpdateAchievementAvatarService } from '@modules/games/services';

export default class AchievementAvatarController {
  public update: RequestHandler = async (request, response) => {
    const file = request.file;
    const gameId = request.game;
    const { id } = request.params;

    const updateAchievementAvatar = container.resolve(
      UpdateAchievementAvatarService,
    );

    const updatedAchievement = await updateAchievementAvatar.execute({
      filename: file.filename,
      id,
      gameId,
    });

    return response.status(201).json(updatedAchievement);
  };
}
