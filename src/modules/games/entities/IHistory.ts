import { IUser } from '@modules/users/entities';

export default interface IHistory {
  user: string | IUser;
  log: Date;
}
