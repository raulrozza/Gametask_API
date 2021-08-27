import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IAchievementsRepository } from '@shared/domain/repositories';
import { IAchievement } from '@shared/domain/entities';

@injectable()
export default class ListGamesService {
  constructor(
    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,
  ) {}

  public async execute(gameId: string): Promise<IAchievement[]> {
    return this.achievementsRepository.findAllFromGame(gameId);
  }
}
