import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';

import IUpdateAchievementDTO from '@modules/games/domain/dtos/IUpdateAchievementDTO';
import { IAchievementsRepository } from '@modules/games/domain/repositories';
import { IAchievement } from '@shared/domain/entities';

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
    try {
      const achievement = await this.achievementsRepository.findOne(id, gameId);

      if (!achievement)
        throw new RequestError(
          'This achievement does not exist',
          errorCodes.RESOURCE_NOT_FOUND,
          400,
        );

      const updatedAchievement = await this.achievementsRepository.update({
        id,
        name,
        description,
        title: title,
        gameId,
      });

      return updatedAchievement;
    } catch (error) {
      if (error instanceof RequestError) throw error;

      throw new RequestError(
        error.message,
        errorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
    }
  }
}
