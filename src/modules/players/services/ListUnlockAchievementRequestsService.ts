import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IUnlockAchievementRequestRepository } from '@modules/players/repositories';
import { IUnlockAchievementRequest } from '../entities';

@injectable()
export default class ListUnlockAchievementRequestsService {
  constructor(
    @inject('UnlockAchievementRequestRepository')
    private unlockAchievementRequestRepository: IUnlockAchievementRequestRepository,
  ) {}

  public async execute(gameId: string): Promise<IUnlockAchievementRequest[]> {
    return this.unlockAchievementRequestRepository.findAllFromGame(gameId);
  }
}
