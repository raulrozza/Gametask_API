import AddAchievementToPlayerAdapter from '@modules/players/domain/adapters/AddAchievementToPlayer';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import UpdatePlayerAdapter from '@modules/players/domain/adapters/UpdatePlayer';
import { IPlayer } from '@modules/players/domain/entities';

interface IFindOneBaseParams {
  id?: string;
  userId?: string;
  gameId?: string;
}

interface IFindByIdParams extends IFindOneBaseParams {
  id: string;
  userId?: string;
  gameId?: string;
}

interface IFindByGameAndUser extends IFindOneBaseParams {
  id?: string;
  userId: string;
  gameId: string;
}

export type IFindOnePlayerParams = IFindByIdParams | IFindByGameAndUser;

export default interface IPlayersRepository {
  findAllFromUser(userId: string): Promise<IPlayer[]>;
  findOne(params: IFindOnePlayerParams): Promise<IPlayer | undefined>;
  create(player: CreatePlayerAdapter): Promise<IPlayer>;
  update(player: UpdatePlayerAdapter, session?: object): Promise<IPlayer>;
  addAchievement(
    params: AddAchievementToPlayerAdapter,
    session?: object,
  ): Promise<IPlayer>;
}
