import { IUnlockAchievementRequestRepository } from '@modules/players/domain/repositories';
import { IUnlockAchievementRequest } from '@modules/players/domain/entities';
import { IFindOneAchievemementRequestParams } from '@modules/players/domain/repositories/IUnlockAchievementRequestRepository';
import CreateUnlockAchievementAdapter from '@modules/players/domain/adapters/CreateUnlockAchievement';
import { FakeUnlockAchievementRequest } from '@modules/players/domain/entities/fakes';

export default class FakeUnlockAchievementRequestRepository
  implements IUnlockAchievementRequestRepository {
  private unlockAchievementRequests: IUnlockAchievementRequest[] = [];

  public async findAllFromGame(
    gameId: string,
  ): Promise<IUnlockAchievementRequest[]> {
    return this.unlockAchievementRequests.filter(
      request => request.game === gameId,
    );
  }

  public async findOne({
    id,
    achievementId,
    requester,
    gameId,
  }: IFindOneAchievemementRequestParams): Promise<
    IUnlockAchievementRequest | undefined
  > {
    return this.unlockAchievementRequests.find(request => {
      if (id && request.id !== id) return false;
      if (achievementId && request.achievement.id !== achievementId)
        return false;
      if (requester && request.requester.id !== requester) return false;
      if (gameId && request.game !== gameId) return false;

      return true;
    });
  }

  public async create({
    achievement,
    game,
    requestDate,
    requester,
    information,
  }: CreateUnlockAchievementAdapter): Promise<IUnlockAchievementRequest> {
    const newRequest = new FakeUnlockAchievementRequest({
      game,
      requester,
      achievement,
      requestDate,
      information,
    });

    this.unlockAchievementRequests.push(newRequest);

    return Promise.resolve(newRequest);
  }

  public async delete(id: string, gameId: string): Promise<void> {
    const foundIndex = this.unlockAchievementRequests.findIndex(
      request => request.id === id && request.game === gameId,
    );

    if (foundIndex < 0) throw new Error('Request not found');

    this.unlockAchievementRequests.splice(foundIndex, 1);
  }
}
