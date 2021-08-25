import { FakeLeaderboard } from '@shared/domain/entities/fakes';
import { v4 as uuid } from 'uuid';

import FakeLeaderboardsRepository from '../repositories/fakes/FakeLeaderboardsRepository';
import ShowCurrentLeaderboardService from './ShowCurrentLeaderboardService';

describe('ShowCurrentLeaderboardService', () => {
  it('should return the current leaderboard', async () => {
    const leaderboardsRepository = new FakeLeaderboardsRepository();
    const showCurrentLeaderboardService = new ShowCurrentLeaderboardService(
      leaderboardsRepository,
    );

    const gameId = uuid();

    const fakeLeaderboard = new FakeLeaderboard({ game: gameId });

    await leaderboardsRepository.create(fakeLeaderboard);

    const leaderboard = await showCurrentLeaderboardService.execute(gameId);

    expect(leaderboard).toHaveProperty('createdAt');
  });
});
