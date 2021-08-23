import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import UpdateActivityAdapter from '@modules/games/domain/adapters/UpdateActivity';
import { IActivity, IHistory } from '@modules/games/domain/entities';

export default interface IActivitiesRepository {
  findAllFromGame(gameId: string): Promise<IActivity[]>;
  findOne(id: string, gameId: string): Promise<IActivity | undefined>;
  create(activity: CreateActivityAdapter): Promise<IActivity>;
  delete(activityId: string, gameId: string): Promise<void>;
  update(activity: UpdateActivityAdapter): Promise<IActivity>;
  updateHistory(
    id: string,
    history: IHistory,
    session?: object,
  ): Promise<IActivity>;
}
