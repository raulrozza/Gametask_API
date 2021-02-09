import { IActivity } from '../entities';

export default interface IActivitiesRepository<
  T extends IActivity = IActivity
> {
  findAllFromGame(gameId: string): Promise<T[]>;
  findOne(id: string, gameId: string): Promise<T | undefined>;
  create(activity: Omit<IActivity, 'id'>): Promise<T>;
  delete(activityId: string, gameId: string): Promise<void>;
  update(activity: IActivity): Promise<IActivity>;
}
