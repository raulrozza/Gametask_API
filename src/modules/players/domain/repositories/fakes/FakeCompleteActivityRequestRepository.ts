import { ICompleteActivityRequest } from '@modules/players/domain/entities';
import { ICompleteActivityRequestRepository } from '@modules/players/domain/repositories';
import CreateCompleteActivityRequestAdapter from '@modules/players/domain/adapters/CreateCompleteActivityRequest';
import { FakeCompleteActivityRequest } from '@modules/players/domain/entities/fakes';

export default class FakeCompleteActivityRequestRepository
  implements ICompleteActivityRequestRepository {
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

  public async create({
    activity,
    completionDate,
    game,
    information,
    requestDate,
    requester,
  }: CreateCompleteActivityRequestAdapter): Promise<ICompleteActivityRequest> {
    const newRequest = new FakeCompleteActivityRequest({
      requester,
      activity,
      game,
      completionDate,
      requestDate,
      information,
    });

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
