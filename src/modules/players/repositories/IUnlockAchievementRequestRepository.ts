import { IUnlockAchievementRequest } from '@modules/players/entities';

export default interface IUnlockAchievementRequestRepository<
  T extends IUnlockAchievementRequest = IUnlockAchievementRequest
> {
  checkIfRequested(
    requester: string,
    gameId: string,
    achievementId: string,
  ): Promise<boolean>;
  findAllFromGame(gameId: string): Promise<T[]>;
  findOne(id: string): Promise<IUnlockAchievementRequest | undefined>;
  create(
    request: Omit<IUnlockAchievementRequest, 'id'>,
    session?: object,
  ): Promise<T>;
  delete(id: string, gameId: string, session?: object): Promise<void>;
}
