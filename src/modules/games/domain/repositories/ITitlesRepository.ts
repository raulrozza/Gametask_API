import UpdateTitleAdapter from '@modules/games/domain/adapters/UpdateTitle';
import ICreateTitleDTO from '@modules/games/domain/dtos/ICreateTitleDTO';
import { ITitle } from '@modules/games/domain/entities';

export default interface ITitlesRepository {
  findAllFromGame(gameId: string, name?: string): Promise<ITitle[]>;
  findOne(id: string, gameId: string): Promise<ITitle | undefined>;
  create(title: ICreateTitleDTO): Promise<ITitle>;
  delete(titleId: string, gameId: string): Promise<void>;
  update(title: UpdateTitleAdapter): Promise<ITitle>;
}
