import CreateLeaderboardAdapter from '@shared/domain/adapters/CreateLeaderboard';
import { FakeLeaderboardsRepository } from '@shared/domain/repositories/fakes';
import { v4 as uuid } from 'uuid';

import ShowCurrentLeaderboardService from './ShowCurrentLeaderboardService';

describe('ShowCurrentLeaderboardService', () => {
  it('should return the current leaderboard', async () => {
    const leaderboardsRepository = new FakeLeaderboardsRepository();
    const showCurrentLeaderboardService = new ShowCurrentLeaderboardService(
      leaderboardsRepository,
    );

    const gameId = uuid();

    await leaderboardsRepository.create(
      new CreateLeaderboardAdapter({ game: gameId }),
    );

    const leaderboard = await showCurrentLeaderboardService.execute(gameId);

    expect(leaderboard).toHaveProperty('createdAt');
  });
});
