import {
  IActivity,
  IActivityLog,
  IHistory,
} from '@modules/games/domain/entities';
import { IActivitiesRepository } from '@modules/games/domain/repositories';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { FakeActivity } from '@modules/games/domain/entities/fakes';
import UpdateActivityAdapter from '@modules/games/domain/adapters/UpdateActivity';
import { FakeUser } from '@shared/domain/entities/fakes';

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
