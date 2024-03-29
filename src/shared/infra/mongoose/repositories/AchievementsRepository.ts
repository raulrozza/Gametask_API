import { isValidObjectId } from 'mongoose';

import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import { IAchievementsRepository } from '@shared/domain/repositories';
import ICreateAchievementDTO from '@modules/games/domain/dtos/ICreateAchievementDTO';
import IUpdateAchievementDTO from '@modules/games/domain/dtos/IUpdateAchievementDTO';
import { IAchievement } from '@shared/domain/entities';
import Achievement from '@shared/infra/mongoose/entities/Achievement';

export default class AchievementsRepository implements IAchievementsRepository {
  public async findAllFromGame(gameId: string): Promise<IAchievement[]> {
    return Achievement.find({ game: gameId })
      .populate('title')
      .populate('game');
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IAchievement | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const achievement = await Achievement.findOne({
      _id: id,
      game: gameId,
    })
      .populate('title')
      .populate('game');

    return achievement || undefined;
  }

  public async create({
    name,
    description,
    gameId,
    title,
  }: ICreateAchievementDTO): Promise<IAchievement> {
    return Achievement.create({
      name,
      description,
      game: gameId,
      title,
    });
  }

  public async delete(achievementId: string, gameId: string): Promise<void> {
    if (!isValidObjectId(achievementId))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Achievement.deleteOne({ _id: achievementId, game: gameId });
  }

  public async update({
    id,
    name,
    description,
    title,
  }: IUpdateAchievementDTO): Promise<IAchievement> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const achievement = await Achievement.findOneAndUpdate(
      { _id: id },
      {
        $set: { name, description, title },
      },
      { new: true },
    )
      .populate('title')
      .populate('game');

    if (!achievement)
      throw new RequestError(
        'Achievement could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return achievement;
  }

  public async updateAvatar(id: string, image: string): Promise<IAchievement> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const achievement = await Achievement.findOneAndUpdate(
      { _id: id },
      {
        $set: { image },
      },
      { new: true },
    )
      .populate('title')
      .populate('game');

    if (!achievement)
      throw new RequestError(
        'Achievement could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return achievement;
  }
}
