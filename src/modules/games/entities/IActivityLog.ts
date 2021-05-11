import { IUser } from '@modules/users/entities';

export default interface IActivityLog {
  version: number;
  log: Date;
  changes: unknown;
  userId: string | IUser;
}
