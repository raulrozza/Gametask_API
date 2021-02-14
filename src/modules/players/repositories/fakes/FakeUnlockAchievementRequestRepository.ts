import { v4 as uuid } from 'uuid';

import { IUnlockAchievementRequest } from '@modules/players/entities';
import { IUnlockAchievementRequestRepository } from '@modules/players/repositories';

export default class FakeUnlockAchievementRequestRepository
  implements IUnlockAchievementRequestRepository<IUnlockAchievementRequest> {
  private unlockAchievementRequests: IUnlockAchievementRequest[] = [];

  public async findAllFromGame(
    gameId: string,
  ): Promise<IUnlockAchievementRequest[]> {
    return this.unlockAchievementRequests.filter(
      request => request.game === gameId,
    );
  }

  public async create(
    request: Omit<IUnlockAchievementRequest, 'id'>,
  ): Promise<IUnlockAchievementRequest> {
    const newRequest = {
      id: uuid(),
      ...request,
    };

    this.unlockAchievementRequests.push(newRequest);

    return Promise.resolve(newRequest);
  }

  public async delete(id: string, gameId: string): Promise<void> {
    const foundIndex = this.unlockAchievementRequests.findIndex(
      request => request.id === id && request.game === gameId,
    );

    this.unlockAchievementRequests.splice(foundIndex, 1);
  }
}
