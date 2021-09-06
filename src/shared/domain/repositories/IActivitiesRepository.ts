import CreateActivityAdapter from '@shared/domain/adapters/CreateActivity';
import UpdateActivityAdapter from '@modules/games/domain/adapters/UpdateActivity';
import { IActivity } from '@shared/domain/entities';
import ActivityHistoryAdapter from '@shared/domain/adapters/ActivityHistory';

export default interface IActivitiesRepository {
  findAllFromGame(gameId: string): Promise<IActivity[]>;
  findOne(id: string, gameId: string): Promise<IActivity | undefined>;
  create(activity: CreateActivityAdapter): Promise<IActivity>;
  delete(activityId: string, gameId: string): Promise<void>;
  update(activity: UpdateActivityAdapter): Promise<IActivity>;
  updateHistory(
    id: string,
    history: ActivityHistoryAdapter,
    session?: object,
  ): Promise<IActivity>;
}
