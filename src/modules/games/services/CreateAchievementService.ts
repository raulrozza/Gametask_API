import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IAchievementsRepository,
  ITitlesRepository,
} from '@modules/games/repositories';
import { IAchievement } from '@modules/games/entities';
import ICreateAchievementDTO from '@modules/games/dtos/ICreateAchievementDTO';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';

@injectable()
export default class CreateAchievementService {
  constructor(
    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,

    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({
    gameId,
    name,
    description,
    title,
  }: ICreateAchievementDTO): Promise<IAchievement> {
    try {
      if (title) {
        const foundTitle = await this.titlesRepository.findOne(title, gameId);

        if (!foundTitle)
          throw new RequestError(
            'The title does not exist.',
            errorCodes.RESOURCE_NOT_FOUND,
            404,
          );
      }

      const createdAchievement = await this.achievementsRepository.create({
        name,
        description,
        game: gameId,
        title,
      });

      return createdAchievement;
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
