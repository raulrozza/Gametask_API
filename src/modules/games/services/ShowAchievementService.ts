import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IAchievementsRepository } from '@modules/games/repositories';
import IShowAchievementDTO from '@modules/games/dtos/IShowAchievementDTO';

@injectable()
export default class ShowAchievementService {
  constructor(
    @inject('AchievementsService')
    private achievementsRepository: IAchievementsRepository,
  ) {}

  public async execute({ gameId, achievementId }: IShowAchievementDTO) {
    return await this.achievementsRepository.findOne(achievementId, gameId);
  }
}
