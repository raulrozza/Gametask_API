import { v4 as uuid } from 'uuid';

import { FakeActivity, FakeGame } from '@modules/games/fakes';
import FakeActivitiesRepository from '@modules/games/repositories/fakes/FakeActivitiesRepository';
import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import FakeTransactionProvider from '@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider';
import FakePlayer from '../fakes/FakePlayer';
import FakeCompleteActivityRequestRepository from '../repositories/fakes/FakeCompleteActivityRequestRepository';
import FakeFeedPostsRepository from '../repositories/fakes/FakeFeedPostsRepository';
import FakeLeaderboardsRepository from '../repositories/fakes/FakeLeaderboardsRepository';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import CompleteActivityService from './CompleteActivityService';
import FakeCompleteActivityRequest from '../fakes/FakeCompleteActivityRequest';
import { IPosition } from '../entities/ILeaderboard';
import { RequestError } from '@shared/errors/implementations';

const initService = async () => {
  const playersRepository = new FakePlayersRepository();
  const activitiesRepository = new FakeActivitiesRepository();
  const feedPostsRepository = new FakeFeedPostsRepository();
  const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository();
  const leaderboardsRepository = new FakeLeaderboardsRepository();
  const gamesRepository = new FakeGamesRepository();

  const transactionProvider = new FakeTransactionProvider();

  const completeActivity = new CompleteActivityService(
    playersRepository,
    activitiesRepository,
    feedPostsRepository,
    completeActivityRequestRepository,
    leaderboardsRepository,
    gamesRepository,
    transactionProvider,
  );

  const userId = uuid();

  const fakeGame = new FakeGame();
  fakeGame.levelInfo.push({
    level: 1,
    requiredExperience: 300,
  });
  const game = await gamesRepository.create(fakeGame);

  const fakePlayer = new FakePlayer(userId, game.id);
  const player = await playersRepository.create(fakePlayer);

  return {
    userId,
    completeActivity,
    game,
    player,
    playersRepository,
    activitiesRepository,
    completeActivityRequestRepository,
    leaderboardsRepository,
  };
};

describe('CompleteActivityService', () => {
  it('should correctly complete the activity, granting the player experience, removing the request, and adding it to the leaderboard', async () => {
    const {
      userId,
      completeActivity,
      player,
      game,
      playersRepository,
      activitiesRepository,
      completeActivityRequestRepository,
      leaderboardsRepository,
    } = await initService();

    const fakeActivity = new FakeActivity(game.id);
    const activity = await activitiesRepository.create(fakeActivity);

    const fakeRequest = new FakeCompleteActivityRequest(
      player.id,
      activity.id,
      game.id,
    );
    const request = await completeActivityRequestRepository.create(fakeRequest);

    await completeActivity.execute({ requestId: request.id, userId });

    const updatedPlayer = await playersRepository.findOne(
      player.id,
      userId,
      game.id,
    );

    expect(updatedPlayer?.experience).toBe(activity.experience);

    const leaderboard = await leaderboardsRepository.getGameCurrentRanking(
      game.id,
    );

    expect(leaderboard?.position).toHaveLength(1);
    expect(leaderboard?.position).toContainEqual<IPosition>({
      experience: activity.experience,
      player: player.id,
    });

    const deletedRequest = await completeActivityRequestRepository.findOne(
      request.id,
    );

    expect(deletedRequest).toBeUndefined();
  });

  it('should level up the player on finishing the activity twice, and increase the players rank on the leaderboard', async () => {
    const {
      userId,
      completeActivity,
      player,
      game,
      playersRepository,
      activitiesRepository,
      completeActivityRequestRepository,
      leaderboardsRepository,
    } = await initService();

    const fakeActivity = new FakeActivity(game.id);
    fakeActivity.experience = 200;
    const activity = await activitiesRepository.create(fakeActivity);

    const fakeRequest = new FakeCompleteActivityRequest(
      player.id,
      activity.id,
      game.id,
    );
    const firstRequest = await completeActivityRequestRepository.create(
      fakeRequest,
    );
    const secondRequest = await completeActivityRequestRepository.create(
      fakeRequest,
    );

    await completeActivity.execute({ requestId: firstRequest.id, userId });
    await completeActivity.execute({ requestId: secondRequest.id, userId });

    const updatedPlayer = await playersRepository.findOne(
      player.id,
      userId,
      game.id,
    );

    expect(updatedPlayer?.experience).toBe(activity.experience * 2);
    expect(updatedPlayer?.level).toBe(game.levelInfo[0].level);

    const leaderboard = await leaderboardsRepository.getGameCurrentRanking(
      game.id,
    );

    expect(leaderboard?.position).toHaveLength(1);
    expect(leaderboard?.position).toContainEqual<IPosition>({
      experience: activity.experience * 2,
      player: player.id,
    });
  });

  it('should throw when trying to complete a non existing request', async () => {
    const { completeActivity, userId } = await initService();

    await expect(
      completeActivity.execute({ requestId: 'non-existing', userId }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
