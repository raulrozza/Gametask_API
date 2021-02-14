import { IUnlockAchievementRequest } from '@modules/players/entities';

export default interface IUnlockAchievementRequestRepository<
  T extends IUnlockAchievementRequest = IUnlockAchievementRequest
> {
  findAllFromGame(gameId: string): Promise<T[]>;
  create(request: Omit<IUnlockAchievementRequest, 'id'>): Promise<T>;
  delete(id: string, gameId: string): Promise<void>;
}
