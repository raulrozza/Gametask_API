import { IActivity, IGame } from '@modules/games/entities';
import { IUser } from '@modules/users/entities';

export default interface ICompleteActivityRequest {
  requester: string | IUser;
  activity: string | IActivity;
  requestDate: Date;
  completionDate: Date;
  information: string;
  game: string | IGame;
}
