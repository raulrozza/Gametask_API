import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IAchievementsRepository } from '@modules/games/repositories';
import { IAchievement } from '@modules/games/entities';

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
