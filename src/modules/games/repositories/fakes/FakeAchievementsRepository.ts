import { v4 as uuid } from 'uuid';
import { IAchievement } from '@modules/games/entities';
import { IAchievementsRepository } from '..';

export default class FakeAchievementsRepository
  implements IAchievementsRepository {
  private readonly achievements: IAchievement[] = [];

  public async findAllFromGame(gameId: string): Promise<IAchievement[]> {
    return Promise.resolve(
      this.achievements.filter(achievement => achievement.game === gameId),
    );
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IAchievement | undefined> {
    return Promise.resolve(
      this.achievements.find(
        achievement => achievement.id === id && achievement.game === gameId,
      ),
    );
  }

  public async create(achievement: IAchievement): Promise<IAchievement> {
    achievement.id = uuid();

    this.achievements.push(achievement);

    return Promise.resolve(achievement);
  }

  public async delete(achievementId: string, gameId: string): Promise<void> {
    const foundIndex = this.achievements.findIndex(
      achievement =>
        achievement.id === achievementId && achievement.game === gameId,
    );

    this.achievements.splice(foundIndex, 1);
  }

  public async update({
    id,
    ...achievement
  }: IAchievement): Promise<IAchievement> {
    const foundIndex = this.achievements.findIndex(
      storedAchievement =>
        storedAchievement.id === id &&
        storedAchievement.game === achievement.game,
    );

    const foundAchievement = this.achievements[foundIndex];

    const updatedAchievement = {
      ...foundAchievement,
      ...achievement,
    };

    this.achievements[foundIndex] = updatedAchievement;

    return updatedAchievement;
  }
}
