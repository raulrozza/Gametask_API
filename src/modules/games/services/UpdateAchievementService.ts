import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';

import IUpdateAchievementDTO from '@modules/games/dtos/IUpdateAchievementDTO';
import { IAchievement } from '@modules/games/entities';
import { IAchievementsRepository } from '@modules/games/repositories';

@injectable()
export default class UpdateAchievementService {
  constructor(
    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,
  ) {}

  public async execute({
    gameId,
    id,
    name,
    description,
    title,
  }: IUpdateAchievementDTO): Promise<IAchievement> {
    const achievement = await this.achievementsRepository.findOne(id, gameId);

    if (!achievement)
      throw new RequestError(
        'This achievement does not exist',
        errorCodes.RESOURCE_NOT_FOUND,
        400,
      );

    const updatedAchievement = await this.achievementsRepository.update({
      id: achievement.id,
      name,
      description,
      title,
      image: achievement.image,
      game: achievement.game,
    });

    return updatedAchievement;
  }
}
