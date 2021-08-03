import { IUser } from '@modules/users/domain/entities';

export default interface IHistory {
  user: string | IUser;
  log: Date;
}
