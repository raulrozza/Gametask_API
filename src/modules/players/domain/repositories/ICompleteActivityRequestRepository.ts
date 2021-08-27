import CreateCompleteActivityRequestAdapter from '@modules/players/domain/adapters/CreateCompleteActivityRequest';
import { ICompleteActivityRequest } from '@modules/players/domain/entities';

export default interface ICompleteActivityRequestRepository {
  findAllFromGame(gameId: string): Promise<ICompleteActivityRequest[]>;
  findOne(id: string): Promise<ICompleteActivityRequest | undefined>;
  create(
    request: CreateCompleteActivityRequestAdapter,
    session?: object,
  ): Promise<ICompleteActivityRequest>;
  delete(id: string, gameId: string, session?: object): Promise<void>;
}
