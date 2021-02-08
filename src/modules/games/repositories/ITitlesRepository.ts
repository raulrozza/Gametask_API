import { ITitle } from '../entities';

export default interface ITitlesRepository<T extends ITitle = ITitle> {
  findAllFromGame(gameId: string, name?: string): Promise<T[]>;
  findOne(id: string, gameId: string): Promise<T | undefined>;
  create(title: Omit<ITitle, 'id'>): Promise<T>;
  delete(titleId: string, gameId: string): Promise<void>;
  update(title: ITitle): Promise<ITitle>;
}
