import { v4 as uuid } from 'uuid';
import { IAchievement } from '@modules/games/domain/entities';
import { IAchievementsRepository } from '@modules/games/domain/repositories';
import ICreateAchievementDTO from '@modules/games/domain/dtos/ICreateAchievementDTO';
import {
  FakeAchievement,
  FakeTitle,
} from '@modules/games/domain/entities/fakes';
import IUpdateAchievementDTO from '@modules/games/domain/dtos/IUpdateAchievementDTO';

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
    const id = uuid();

    const achievement = new FakeAchievement({
      id,
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
}
