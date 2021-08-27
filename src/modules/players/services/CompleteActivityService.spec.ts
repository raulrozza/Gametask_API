import {
  FakeActivitiesRepository,
  FakeLeaderboardsRepository,
  FakeGamesRepository,
} from '@shared/domain/repositories/fakes';

import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import CompleteActivityService from './CompleteActivityService';
import { RequestError } from '@shared/infra/errors';
import { FakeCompleteActivityRequest } from '@modules/players/domain/entities/fakes';
import {
  FakeActivity,
  FakeGame,
  FakeUser,
} from '@shared/domain/entities/fakes';
import CreateGameAdapter from '@shared/domain/adapters/CreateGame';
import CreateActivityAdapter from '@shared/domain/adapters/CreateActivity';

import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import FakeCompleteActivityRequestRepository from '@modules/players/domain/repositories/fakes/FakeCompleteActivityRequestRepository';
import CreateCompleteActivityRequestAdapter from '@modules/players/domain/adapters/CreateCompleteActivityRequest';
import FakeFeedPostsRepository from '@modules/players/domain/repositories/fakes/FakeFeedPostsRepository';
import UpdateGameAdapter from '@modules/games/domain/adapters/UpdateGameAdapter';

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

  const user = new FakeUser();

  const fakeGame = new FakeGame();

  const createdGame = await gamesRepository.create(
    new CreateGameAdapter({
      name: fakeGame.name,
      description: fakeGame.description,
      creatorId: user.id,
    }),
  );
  const game = await gamesRepository.update(
    new UpdateGameAdapter({
      ...createdGame,
      levelInfo: [
        {
          level: 1,
          requiredExperience: 0,
        },
        {
          level: 2,
          requiredExperience: 300,
        },
        {
          level: 3,
          requiredExperience: 400,
        },
        {
          level: 4,
          requiredExperience: 600,
        },
      ],
      ranks: [
        {
          level: 4,
          color: '#000',
          name: 'Rank',
          tag: 'RNK',
        },
        {
          level: 3,
          color: '#000',
          name: 'Rank',
          tag: 'RNK',
        },
      ],
    }),
  );

  //

  const player = await playersRepository.create(
    new CreatePlayerAdapter({
      userId: user.id,
      gameId: game.id,
      gameRanks: game.ranks,
      gameLevels: game.levelInfo,
    }),
  );

  return {
    userId: user.id,
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

    const fakeActivity = new FakeActivity({ game: game.id });
    const activity = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId: game.id,
        name: fakeActivity.name,
        experience: fakeActivity.experience,
        description: fakeActivity.description,
        dmRules: fakeActivity.dmRules,
      }),
    );

    const fakeRequest = new FakeCompleteActivityRequest({
      requester: player.id,
      activity: activity.id,
      game: game.id,
    });
    const request = await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeRequest,
        requester: player.id,
        activity: activity.id,
      }),
    );

    await completeActivity.execute({ requestId: request.id, userId });

    const updatedPlayer = await playersRepository.findOne({
      id: player.id,
    });

    const expectedExperience = player.experience + activity.experience;
    expect(updatedPlayer?.experience).toBe(expectedExperience);

    const leaderboard = await leaderboardsRepository.getGameCurrentRanking(
      game.id,
    );

    const positions = leaderboard?.position.map(position => ({
      experience: position.experience,
      playerId: position.player.id,
    }));
    expect(positions).toHaveLength(1);
    expect(positions).toContainEqual({
      experience: activity.experience,
      playerId: player.id,
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

    const fakeActivity = new FakeActivity({ game: game.id });
    const activity = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId: game.id,
        name: fakeActivity.name,
        experience: 350,
        description: fakeActivity.description,
        dmRules: fakeActivity.dmRules,
      }),
    );

    const fakeRequest = new FakeCompleteActivityRequest({
      requester: player.id,
      activity: activity.id,
      game: game.id,
    });
    const firstRequest = await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeRequest,
        requester: player.id,
        activity: activity.id,
      }),
    );
    const secondRequest = await completeActivityRequestRepository.create(
      new CreateCompleteActivityRequestAdapter({
        ...fakeRequest,
        requester: player.id,
        activity: activity.id,
      }),
    );

    await completeActivity.execute({ requestId: firstRequest.id, userId });
    await completeActivity.execute({ requestId: secondRequest.id, userId });

    const updatedPlayer = await playersRepository.findOne({
      id: player.id,
      userId,
      gameId: game.id,
    });

    const expectedLevel = 4;
    const expectedRank = game.ranks.find(rank => rank.level === expectedLevel);
    const expectedLevelInfo = game.levelInfo.find(
      info => info.level === expectedLevel,
    );

    const expectedExperience = player.experience + activity.experience * 2;
    expect(updatedPlayer?.experience).toBe(expectedExperience);
    expect(updatedPlayer?.level).toBe(expectedLevelInfo?.level);
    expect(updatedPlayer?.rank).toEqual(expectedRank);

    const leaderboard = await leaderboardsRepository.getGameCurrentRanking(
      game.id,
    );

    const positions = leaderboard?.position.map(position => ({
      experience: position.experience,
      playerId: position.player.id,
    }));
    expect(positions).toHaveLength(1);
    expect(positions).toContainEqual({
      experience: activity.experience * 2,
      playerId: player.id,
    });
  });

  it('should throw when trying to complete a non existing request', async () => {
    const { completeActivity, userId } = await initService();

    await expect(
      completeActivity.execute({ requestId: 'non-existing', userId }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
