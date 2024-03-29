import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import CreateActivityAdapter from '@shared/domain/adapters/CreateActivity';
import UpdateActivityAdapter from '@modules/games/domain/adapters/UpdateActivity';
import { FakeActivity, FakeUser } from '@shared/domain/entities/fakes';
import { IActivity, IActivityLog } from '@shared/domain/entities';
import { IActivitiesRepository } from '@shared/domain/repositories';
import ActivityHistoryAdapter from '@shared/domain/adapters/ActivityHistory';

export default class FakeActivitiesRepository implements IActivitiesRepository {
  private readonly activities: IActivity[] = [];

  public async findAllFromGame(gameId: string): Promise<IActivity[]> {
    return Promise.resolve(
      this.activities.filter(activity => activity.game.id === gameId),
    );
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IActivity | undefined> {
    return Promise.resolve(
      this.activities.find(
        activity => activity.id === id && activity.game.id === gameId,
      ),
    );
  }

  public async create({
    name,
    description,
    dmRules,
    experience,
    game,
  }: CreateActivityAdapter): Promise<IActivity> {
    const activity = new FakeActivity({
      game,
      name,
      description,
      dmRules: { value: dmRules },
      experience,
    });

    this.activities.push(activity);

    return Promise.resolve(activity);
  }

  public async delete(activityId: string, gameId: string): Promise<void> {
    const foundIndex = this.activities.findIndex(
      activity => activity.id === activityId && activity.game.id === gameId,
    );

    this.activities.splice(foundIndex, 1);
  }

  public async update({
    id,
    changelog,
    game,
    ...activity
  }: UpdateActivityAdapter): Promise<IActivity> {
    const foundIndex = this.activities.findIndex(
      storedActivity =>
        storedActivity.id === id && storedActivity.game.id === game,
    );

    if (foundIndex < 0)
      throw new RequestError(
        'This activity does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundActivity = this.activities[foundIndex];

    const formattedChangelog: IActivityLog[] = changelog.map(log => ({
      changes: log.changes,
      log: log.log,
      version: log.version,
      user: new FakeUser({ id: log.user }),
    }));

    const updatedActivity = {
      ...foundActivity,
      ...activity,
      changelog: [...formattedChangelog, ...foundActivity.changelog],
    };

    this.activities[foundIndex] = updatedActivity;

    return updatedActivity;
  }

  public async updateHistory(
    id: string,
    history: ActivityHistoryAdapter,
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
    foundActivity.history.unshift({
      log: history.log,
      user: new FakeUser({ id: history.user }),
    });
    this.activities[foundIndex] = foundActivity;

    return foundActivity;
  }
}
