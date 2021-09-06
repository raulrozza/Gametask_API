import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IAchievementsRepository } from '@shared/domain/repositories';
import IShowAchievementDTO from '@modules/games/domain/dtos/IShowAchievementDTO';

@injectable()
export default class ShowAchievementService {
  constructor(
    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,
  ) {}

  public async execute({ gameId, achievementId }: IShowAchievementDTO) {
    return this.achievementsRepository.findOne(achievementId, gameId);
  }
}
