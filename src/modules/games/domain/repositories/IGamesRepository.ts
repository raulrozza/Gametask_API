import { IGame } from '@modules/games/domain/entities';

export default interface IGamesRepository<T extends IGame = IGame> {
  findAllFromUser(userId: string): Promise<T[]>;
  findOne(id: string, userId?: string): Promise<T | undefined>;
  create(game: Omit<IGame, 'id'>): Promise<T>;
  update(game: IGame): Promise<IGame>;
  updateRegisters(
    id: string,
    increase: number,
    session?: object,
  ): Promise<IGame>;
}
