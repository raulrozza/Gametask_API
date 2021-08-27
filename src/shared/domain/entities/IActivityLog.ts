import { IUser } from '@shared/domain/entities';

export default interface IActivityLog {
  version: number;
  log: Date;
  changes: unknown;
  user: IUser;
}
