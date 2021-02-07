import { IGame } from '../entities';

export default interface IGamesRepository<T extends IGame = IGame> {
  findAllFromUser(userId: string): Promise<T[]>;
  findOne(id: string): Promise<T | undefined>;
  create(game: Omit<IGame, 'id'>): Promise<T>;
  update(game: IGame): Promise<IGame>;
}
