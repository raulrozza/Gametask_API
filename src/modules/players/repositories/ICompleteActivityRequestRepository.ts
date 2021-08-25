import { ICompleteActivityRequest } from '@modules/players/domain/entities';

export default interface ICompleteActivityRequestRepository<
  T extends ICompleteActivityRequest = ICompleteActivityRequest
> {
  findAllFromGame(gameId: string): Promise<T[]>;
  findOne(id: string): Promise<ICompleteActivityRequest | undefined>;
  create(
    player: Omit<ICompleteActivityRequest, 'id'>,
    session?: object,
  ): Promise<T>;
  delete(id: string, gameId: string, session?: object): Promise<void>;
}
