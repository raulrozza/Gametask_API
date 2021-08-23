import { IActivity, IGame } from '@modules/games/domain/entities';
import { IUser } from '@shared/domain/entities';

export default interface ICompleteActivityRequest {
  id: string;
  requester: string | IUser;
  activity: string | IActivity;
  requestDate: Date;
  completionDate: Date;
  information: string;
  game: string | IGame;
}
