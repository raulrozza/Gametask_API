import ICreateAchievementDTO from '@modules/games/domain/dtos/ICreateAchievementDTO';
import IUpdateAchievementDTO from '@modules/games/domain/dtos/IUpdateAchievementDTO';
import { FakeAchievement, FakeTitle } from '@shared/domain/entities/fakes';
import { IAchievement } from '@shared/domain/entities';
import { IAchievementsRepository } from '@shared/domain/repositories';

export default class FakeAchievementsRepository
  implements IAchievementsRepository {
  private readonly achievements: IAchievement[] = [];

  public async findAllFromGame(gameId: string): Promise<IAchievement[]> {
    return Promise.resolve(
      this.achievements.filter(achievement => achievement.game.id === gameId),
    );
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IAchievement | undefined> {
    return Promise.resolve(
      this.achievements.find(
        achievement => achievement.id === id && achievement.game.id === gameId,
      ),
    );
  }

  public async create({
    name,
    title,
    description,
    gameId,
  }: ICreateAchievementDTO): Promise<IAchievement> {
    const achievement = new FakeAchievement({
      name,
      description,
      game: gameId,
      title,
    });

    this.achievements.push(achievement);

    return Promise.resolve(achievement);
  }

  public async delete(achievementId: string, gameId: string): Promise<void> {
    const foundIndex = this.achievements.findIndex(
      achievement =>
        achievement.id === achievementId && achievement.game.id === gameId,
    );

    if (foundIndex < 0) throw new Error('Achievement not found');

    this.achievements.splice(foundIndex, 1);
  }

  public async update({
    id,
    gameId,
    name,
    description,
    title,
  }: IUpdateAchievementDTO): Promise<IAchievement> {
    const foundIndex = this.achievements.findIndex(
      storedAchievement =>
        storedAchievement.id === id && storedAchievement.game.id === gameId,
    );

    if (foundIndex < 0) throw new Error('Achievement not found');

    const foundAchievement = this.achievements[foundIndex];

    const updatedAchievement = {
      ...foundAchievement,
      name,
      description,
      title: title ? new FakeTitle({ id: title }) : undefined,
    };

    this.achievements[foundIndex] = updatedAchievement;

    return updatedAchievement;
  }

  public async updateAvatar(id: string, image: string): Promise<IAchievement> {
    const foundIndex = this.achievements.findIndex(
      storedAchievement => storedAchievement.id === id,
    );

    if (foundIndex < 0) throw new Error('Achievement not found');

    const updatedAchievement = {
      ...this.achievements[foundIndex],
      image,
    };

    this.achievements[foundIndex] = updatedAchievement;

    return updatedAchievement;
  }
}
