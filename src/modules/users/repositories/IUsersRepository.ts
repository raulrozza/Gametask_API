import { IUser } from '../entities';

export default interface IUsersRepository {
  findAll(): Promise<IUser[]>;
  findOne(id: string): Promise<IUser | undefined>;
  create(user: IUser): Promise<IUser>;
}
