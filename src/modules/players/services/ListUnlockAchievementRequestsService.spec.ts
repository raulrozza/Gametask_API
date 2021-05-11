import { v4 as uuid } from 'uuid';

import FakeUnlockAchievementRequest from '../fakes/FakeUnlockAchievementRequest';
import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import ListUnlockAchievementRequestsService from './ListUnlockAchievementRequestsService';

describe('ListUnlockAchievementRequestsService', () => {
  it('should list both the achievement requests from the game', async () => {
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
    const listUnlockAchievementRequestsService = new ListUnlockAchievementRequestsService(
      unlockAchievementRequestRepository,
    );

    const playerId = uuid();
    const gameId = uuid();
    const achievementId = uuid();

    const fakeRequest = new FakeUnlockAchievementRequest(
      gameId,
      playerId,
      achievementId,
    );

    await unlockAchievementRequestRepository.create({ ...fakeRequest });
    await unlockAchievementRequestRepository.create({
      ...fakeRequest,
      game: 'another-game',
    });
    await unlockAchievementRequestRepository.create({
      ...fakeRequest,
      achievement: 'another-achievement',
    });

    const requests = await listUnlockAchievementRequestsService.execute(gameId);

    expect(requests).toHaveLength(2);
  });
});
