import { FakeUnlockAchievementRequest } from '@modules/players/domain/entities/fakes';
import { v4 as uuid } from 'uuid';

import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import ListUnlockAchievementRequestsService from './ListUnlockAchievementRequestsService';

describe('ListUnlockAchievementRequestsService', () => {
  it('should list both the achievement requests from the game', async () => {
    const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
    const listUnlockAchievementRequestsService = new ListUnlockAchievementRequestsService(
      unlockAchievementRequestRepository,
    );

    const gameId = uuid();

    const fakeRequest = new FakeUnlockAchievementRequest({ game: gameId });

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
