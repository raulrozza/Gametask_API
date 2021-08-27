import CreateUnlockAchievementAdapter from '@modules/players/domain/adapters/CreateUnlockAchievement';
import { IUnlockAchievementRequest } from '@modules/players/domain/entities';

interface IFindOneBaseParams {
  id?: string;
  requester?: string;
  gameId?: string;
  achievementId?: string;
}

interface IFindByIdParams extends IFindOneBaseParams {
  id: string;
}

interface ICheckExistanceParams extends IFindOneBaseParams {
  requester: string;
  gameId: string;
  achievementId: string;
}

export type IFindOneAchievemementRequestParams =
  | IFindByIdParams
  | ICheckExistanceParams;

export default interface IUnlockAchievementRequestRepository {
  findAllFromGame(gameId: string): Promise<IUnlockAchievementRequest[]>;
  findOne(
    params: IFindOneAchievemementRequestParams,
  ): Promise<IUnlockAchievementRequest | undefined>;
  create(
    request: CreateUnlockAchievementAdapter,
    session?: object,
  ): Promise<IUnlockAchievementRequest>;
  delete(id: string, gameId: string, session?: object): Promise<void>;
}
