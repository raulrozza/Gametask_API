import { IActivitiesRepository } from '@modules/games/repositories';
import { IActivity } from '@modules/games/entities';
import Activity, {
  IActivityDocument,
} from '@modules/games/infra/mongoose/entities/Activity';

export default class ActivitiesRepository
  implements IActivitiesRepository<IActivityDocument> {
  public async findAllFromGame(gameId: string): Promise<IActivityDocument[]> {
    return await Activity.find({ game: gameId });
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IActivityDocument | undefined> {
    return await Activity.findOne({
      _id: id,
      game: gameId,
    });
  }

  public async create(
    activity: Omit<IActivity, 'id'>,
  ): Promise<IActivityDocument> {
    return await Activity.create(activity);
  }

  public async delete(activityId: string, gameId: string): Promise<void> {
    await Activity.deleteOne({ _id: activityId, game: gameId });
  }

  public async update({
    id,
    changelog,
    ...activity
  }: IActivity): Promise<IActivity> {
    const updatedActivity = await Activity.updateOne(
      {
        _id: id,
      },
      {
        $set: activity,
        $push: {
          changelog: {
            $each: changelog,
            $position: 0,
          },
        },
      },
    );

    return updatedActivity;
  }
}
