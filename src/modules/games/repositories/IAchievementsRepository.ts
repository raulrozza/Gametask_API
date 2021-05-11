import { IAchievement } from '../entities';

export default interface IAchievementsRepository<
  T extends IAchievement = IAchievement
> {
  findAllFromGame(gameId: string): Promise<T[]>;
  findOne(id: string, gameId: string): Promise<T | undefined>;
  create(achievement: Omit<IAchievement, 'id'>): Promise<T>;
  delete(achievementId: string, gameId: string): Promise<void>;
  update(achievement: IAchievement): Promise<IAchievement>;
}
