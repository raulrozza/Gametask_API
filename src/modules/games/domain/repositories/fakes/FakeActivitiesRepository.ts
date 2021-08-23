import { v4 as uuid } from 'uuid';
import { IActivity, IHistory } from '@modules/games/domain/entities';
import { IActivitiesRepository } from '@modules/games/domain/repositories';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';

export default class FakeActivitiesRepository implements IActivitiesRepository {
  private readonly activities: IActivity[] = [];

  public async findAllFromGame(gameId: string): Promise<IActivity[]> {
    return Promise.resolve(
      this.activities.filter(activity => activity.game === gameId),
    );
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IActivity | undefined> {
    return Promise.resolve(
      this.activities.find(
        activity => activity.id === id && activity.game === gameId,
      ),
    );
  }

  public async create(activity: IActivity): Promise<IActivity> {
    activity.id = uuid();

    this.activities.push(activity);

    return Promise.resolve(activity);
  }

  public async delete(activityId: string, gameId: string): Promise<void> {
    const foundIndex = this.activities.findIndex(
      activity => activity.id === activityId && activity.game === gameId,
    );

    this.activities.splice(foundIndex, 1);
  }

  public async update({
    id,
    changelog,
    ...activity
  }: IActivity): Promise<IActivity> {
    const foundIndex = this.activities.findIndex(
      storedActivity =>
        storedActivity.id === id && storedActivity.game === activity.game,
    );

    if (foundIndex < 0)
      throw new RequestError(
        'This activity does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundActivity = this.activities[foundIndex];

    const updatedActivity = {
      ...foundActivity,
      ...activity,
      changelog: [...changelog, ...foundActivity.changelog],
    };

    this.activities[foundIndex] = updatedActivity;

    return updatedActivity;
  }

  public async updateHistory(
    id: string,
    history: IHistory,
  ): Promise<IActivity> {
    const foundIndex = this.activities.findIndex(
      storedActivity => storedActivity.id === id,
    );

    if (foundIndex < 0)
      throw new RequestError(
        'This activity does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundActivity = this.activities[foundIndex];
    foundActivity.history.unshift(history);
    this.activities[foundIndex] = foundActivity;

    return foundActivity;
  }
}
