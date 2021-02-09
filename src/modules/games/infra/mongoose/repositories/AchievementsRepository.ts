import { IAchievementsRepository } from '@modules/games/repositories';
import { IAchievement } from '@modules/games/entities';
import Achievement, {
  IAchievementDocument,
} from '@modules/games/infra/mongoose/entities/Achievement';

export default class AchievementsRepository
  implements IAchievementsRepository<IAchievementDocument> {
  public async findAllFromGame(
    gameId: string,
  ): Promise<IAchievementDocument[]> {
    return await Achievement.find({ game: gameId }).populate('title');
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IAchievementDocument | undefined> {
    return await Achievement.findOne({
      _id: id,
      game: gameId,
    }).populate('title');
  }

  public async create(
    achievement: Omit<IAchievement, 'id'>,
  ): Promise<IAchievementDocument> {
    return await Achievement.create(achievement);
  }

  public async delete(achievementId: string, gameId: string): Promise<void> {
    await Achievement.deleteOne({ _id: achievementId, game: gameId });
  }

  public async update({
    id,
    ...achievement
  }: IAchievement): Promise<IAchievement> {
    const updatedAchievement = await Achievement.updateOne(
      {
        _id: id,
      },
      {
        $set: achievement,
      },
    );

    return updatedAchievement;
  }
}
