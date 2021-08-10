import { IUser } from '@modules/users/domain/entities';

export default interface IActivityLog {
  version: number;
  log: Date;
  changes: unknown;
  userId: string | IUser;
}
