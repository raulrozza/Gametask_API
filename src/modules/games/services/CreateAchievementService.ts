import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IAchievementsRepository } from '@modules/games/repositories';
import { IAchievement } from '@modules/games/entities';
import ICreateAchievementDTO from '@modules/games/dtos/ICreateAchievementDTO';

@injectable()
export default class CreateAchievementService {
  constructor(
    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,
  ) {}

  public async execute({
    gameId,
    name,
    description,
    title,
  }: ICreateAchievementDTO): Promise<IAchievement> {
    const createdAchievement = await this.achievementsRepository.create({
      name,
      description,
      game: gameId,
      title,
    });

    return createdAchievement;
  }
}
