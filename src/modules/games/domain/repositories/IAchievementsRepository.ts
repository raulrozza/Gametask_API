import ICreateAchievementDTO from '@modules/games/domain/dtos/ICreateAchievementDTO';
import IUpdateAchievementDTO from '@modules/games/domain/dtos/IUpdateAchievementDTO';
import { IAchievement } from '@shared/domain/entities';

export default interface IAchievementsRepository {
  findAllFromGame(gameId: string): Promise<IAchievement[]>;
  findOne(id: string, gameId: string): Promise<IAchievement | undefined>;
  create(achievement: ICreateAchievementDTO): Promise<IAchievement>;
  delete(achievementId: string, gameId: string): Promise<void>;
  update(achievement: IUpdateAchievementDTO): Promise<IAchievement>;
  updateAvatar(id: string, image: string): Promise<IAchievement>;
}
