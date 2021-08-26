import { ICreateUserDTO, IUpdateUserDTO } from '@modules/users/domain/dtos';
import { IUser } from '@shared/domain/entities';

export default interface IUsersRepository {
  findAll(): Promise<IUser[]>;
  findOne(id: string): Promise<IUser | undefined>;
  findOneByEmail(email: string): Promise<IUser | undefined>;
  create(data: ICreateUserDTO): Promise<IUser>;
  update(data: IUpdateUserDTO): Promise<IUser>;
}
