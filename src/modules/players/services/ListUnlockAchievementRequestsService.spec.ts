import { FakeUnlockAchievementRequest } from '@modules/players/domain/entities/fakes';
import { v4 as uuid } from 'uuid';

import FakeUnlockAchievementRequestRepository from '@modules/players/domain/repositories/fakes/FakeUnlockAchievementRequestRepository';
import ListUnlockAchievementRequestsService from './ListUnlockAchievementRequestsService';
import CreateUnlockAchievementAdapter from '@modules/players/domain/adapters/CreateUnlockAchievement';

describe('ListUnlockAchievementRequestsService', () => {
  it('should list both the achievement requests from the game', async () => {
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
    const listUnlockAchievementRequestsService = new ListUnlockAchievementRequestsService(
      unlockAchievementRequestRepository,
    );

    const gameId = uuid();

    const fakeRequest = new FakeUnlockAchievementRequest({ game: gameId });

    await unlockAchievementRequestRepository.create(
      new CreateUnlockAchievementAdapter({
        ...fakeRequest,
        requester: fakeRequest.requester.id,
        achievement: fakeRequest.achievement.id,
      }),
    );
    await unlockAchievementRequestRepository.create(
      new CreateUnlockAchievementAdapter({
        ...fakeRequest,
        requester: fakeRequest.requester.id,
        achievement: fakeRequest.achievement.id,
        game: 'another-game',
      }),
    );
    await unlockAchievementRequestRepository.create(
      new CreateUnlockAchievementAdapter({
        ...fakeRequest,
        requester: fakeRequest.requester.id,
        achievement: 'another-achievement',
      }),
    );

    const requests = await listUnlockAchievementRequestsService.execute(gameId);

    expect(requests).toHaveLength(2);
  });
});
