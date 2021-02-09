import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IAchievementsRepository } from '@modules/games/repositories';
import IDeleteAchievementDTO from '@modules/games/dtos/IDeleteAchievementDTO';

@injectable()
export default class DeleteAchievementService {
  constructor(
    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,
  ) {}

  public async execute({ gameId, id }: IDeleteAchievementDTO): Promise<void> {
    await this.achievementsRepository.delete(id, gameId);
  }
}
