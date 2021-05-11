import { IUser } from '../entities';

export default interface IUsersRepository<T extends IUser = IUser> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | undefined>;
  findOneByEmail(email: string): Promise<T | undefined>;
  create(user: Omit<IUser, 'id'>): Promise<T>;
  update(user: IUser): Promise<IUser>;
}
