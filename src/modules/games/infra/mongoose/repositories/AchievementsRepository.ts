import { isValidObjectId } from 'mongoose';

import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';
import { IAchievementsRepository } from '@modules/games/repositories';
import { IAchievement } from '@modules/games/entities';
import Achievement, {
  IAchievementDocument,
} from '@modules/games/infra/mongoose/entities/Achievement';

export default class AchievementsRepository
  implements IAchievementsRepository<IAchievementDocument> {
  public async findAllFromGame(
    gameId: string,
  ): Promise<IAchievementDocument[]> {
    return await Achievement.find({ game: gameId }).populate('title');
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IAchievementDocument | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return await Achievement.findOne({
      _id: id,
      game: gameId,
    }).populate('title');
  }

  public async create({
    name,
    description,
    game,
    image,
    title,
  }: Omit<IAchievement, 'id'>): Promise<IAchievementDocument> {
    return await Achievement.create({
      name,
      description,
      game,
      image,
      title,
    });
  }

  public async delete(achievementId: string, gameId: string): Promise<void> {
    if (!isValidObjectId(achievementId))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    await Achievement.deleteOne({ _id: achievementId, game: gameId });
  }

  public async update({
    id,
    name,
    description,
    image,
    title,
  }: IAchievement): Promise<IAchievement> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
          image,
          title,
        },
      },
      { new: true },
    );

    return updatedAchievement;
  }
}
