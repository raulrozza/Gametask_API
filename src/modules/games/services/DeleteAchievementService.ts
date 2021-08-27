import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IAchievementsRepository } from '@shared/domain/repositories';
import IDeleteAchievementDTO from '@modules/games/domain/dtos/IDeleteAchievementDTO';

@injectable()
export default class DeleteAchievementService {
  constructor(
    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,
  ) {}

  public async execute({ gameId, id }: IDeleteAchievementDTO): Promise<void> {
    return this.achievementsRepository.delete(id, gameId);
  }
}
