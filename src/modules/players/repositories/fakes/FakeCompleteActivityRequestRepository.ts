import { v4 as uuid } from 'uuid';

import { ICompleteActivityRequest } from '@modules/players/entities';
import { ICompleteActivityRequestRepository } from '@modules/players/repositories';

export default class FakeCompleteActivityRequestRepository
  implements ICompleteActivityRequestRepository<ICompleteActivityRequest> {
  private completeActivityRequests: ICompleteActivityRequest[] = [];

  public async findAllFromGame(
    gameId: string,
  ): Promise<ICompleteActivityRequest[]> {
    return this.completeActivityRequests.filter(
      request => request.game === gameId,
    );
  }

  public async findOne(
    id: string,
  ): Promise<ICompleteActivityRequest | undefined> {
    return this.completeActivityRequests.find(request => request.id === id);
  }

  public async create(
    request: Omit<ICompleteActivityRequest, 'id'>,
  ): Promise<ICompleteActivityRequest> {
    const newRequest = {
      id: uuid(),
      ...request,
    };

    this.completeActivityRequests.push(newRequest);

    return Promise.resolve(newRequest);
  }

  public async delete(id: string, gameId: string): Promise<void> {
    const foundIndex = this.completeActivityRequests.findIndex(
      request => request.id === id && request.game === gameId,
    );

    this.completeActivityRequests.splice(foundIndex, 1);
  }
}
