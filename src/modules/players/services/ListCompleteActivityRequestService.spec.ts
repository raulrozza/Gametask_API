import { FakeCompleteActivityRequest } from '@modules/players/domain/entities/fakes';
import { v4 as uuid } from 'uuid';

import FakeCompleteActivityRequestRepository from '@modules/players/domain/repositories/fakes/FakeCompleteActivityRequestRepository';
import ListCompleteActivityRequestsService from './ListCompleteActivityRequestsService';
import CreateCompleteActivityRequestAdapter from '@modules/players/domain/adapters/CreateCompleteActivityRequest';

describe('ListCompleteActivityRequestsService', () => {
  it('should list both the activity requests from the game', async () => {
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
    const listCompleteActivityRequests = new ListCompleteActivityRequestsService(
      completeActivityRequestRepository,
    );

    const playerId = uuid();
    const gameId = uuid();
    const activityId = uuid();

    const fakeRequest = new FakeCompleteActivityRequest({
      requester: playerId,
      activity: activityId,
      game: gameId,
    });

    await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeRequest,
        requester: fakeRequest.requester.id,
        activity: fakeRequest.activity.id,
      }),
    );
    await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeRequest,
        requester: fakeRequest.requester.id,
        activity: fakeRequest.activity.id,
        game: 'another-game',
      }),
    );
    await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeRequest,
        requester: fakeRequest.requester.id,
        activity: 'another-activity',
      }),
    );

    const requests = await listCompleteActivityRequests.execute(gameId);

    expect(requests).toHaveLength(2);
  });
});
