import { v4 as uuid } from 'uuid';

import FakeCompleteActivityRequest from '../fakes/FakeCompleteActivityRequest';
import FakeCompleteActivityRequestRepository from '../repositories/fakes/FakeCompleteActivityRequestRepository';
import ListCompleteActivityRequestsService from './ListCompleteActivityRequestsService';

describe('ListCompleteActivityRequestsService', () => {
  it('should list both the activity requests from the game', async () => {
    const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
    const listCompleteActivityRequests = new ListCompleteActivityRequestsService(
      completeActivityRequestRepository,
    );

    const playerId = uuid();
    const gameId = uuid();
    const activityId = uuid();

    const { id: _, ...fakeRequest } = new FakeCompleteActivityRequest(
      playerId,
      activityId,
      gameId,
    );

    await completeActivityRequestRepository.create({ ...fakeRequest });
    await completeActivityRequestRepository.create({
      ...fakeRequest,
      game: 'another-game',
    });
    await completeActivityRequestRepository.create({
      ...fakeRequest,
      activity: 'another-achievement',
    });

    const requests = await listCompleteActivityRequests.execute(gameId);

    expect(requests).toHaveLength(2);
  });
});
