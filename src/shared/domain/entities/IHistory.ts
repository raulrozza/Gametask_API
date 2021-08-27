import { IUser } from '@shared/domain/entities';

export default interface IHistory {
  user: IUser;
  log: Date;
}
