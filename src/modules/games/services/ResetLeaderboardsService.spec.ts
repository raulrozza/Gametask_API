import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { v4 as uuid } from 'uuid';

import FakeLeaderboardsRepository from '../repositories/fakes/FakeLeaderboardsRepository';
import ResetLeaderboardsService from './ResetLeaderboardsService';

describe('ResetLeaderboardsService', () => {
  it('should update the title correctly', async () => {
    const leaderboardsRepository = new FakeLeaderboardsRepository();
    const resetService = new ResetLeaderboardsService(leaderboardsRepository);

    const gameId = uuid();

    await resetService.execute(gameId);

    const leaderboards = leaderboardsRepository.getLeaderboards();

    expect(leaderboards).toHaveLength(1);
  });

  it('should throw when an request error occurs', async () => {
    const leaderboardsRepository = new FakeLeaderboardsRepository();
    const resetService = new ResetLeaderboardsService(leaderboardsRepository);

    const gameId = uuid();

    leaderboardsRepository.create = jest.fn(() =>
      Promise.reject(
        new RequestError('Error', errorCodes.INTERNAL_SERVER_ERROR),
      ),
    );

    await expect(resetService.execute(gameId)).rejects.toBeInstanceOf(
      RequestError,
    );
  });

  it('should throw when an ordinary error occurs', async () => {
    const leaderboardsRepository = new FakeLeaderboardsRepository();
    const resetService = new ResetLeaderboardsService(leaderboardsRepository);

    const gameId = uuid();

    leaderboardsRepository.create = jest.fn(() =>
      Promise.reject(new Error('Error')),
    );

    await expect(resetService.execute(gameId)).rejects.toBeInstanceOf(
      RequestError,
    );
  });
});
