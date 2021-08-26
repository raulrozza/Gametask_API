import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import UpdateGameAdapter from '@modules/games/domain/adapters/UpdateGameAdapter';
import { IGame } from '@shared/domain/entities';

export default interface IGamesRepository {
  findAllFromUser(userId: string): Promise<IGame[]>;
  findOne(id: string, userId?: string): Promise<IGame | undefined>;
  create(game: CreateGameAdapter): Promise<IGame>;
  update(game: UpdateGameAdapter): Promise<IGame>;
  updateAvatar(id: string, image: string): Promise<IGame>;
  updateRegisters(
    id: string,
    increase: number,
    session?: object,
  ): Promise<IGame>;
}
