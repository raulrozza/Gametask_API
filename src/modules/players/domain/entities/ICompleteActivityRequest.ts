import { IActivity, IUser } from '@shared/domain/entities';

export default interface ICompleteActivityRequest {
  id: string;
  requester: IUser;
  activity: IActivity;
  requestDate: Date;
  completionDate: Date;
  information: string;
  game: string;
}
