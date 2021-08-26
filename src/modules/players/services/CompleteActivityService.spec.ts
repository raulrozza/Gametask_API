import { v4 as uuid } from 'uuid';

import FakeActivitiesRepository from '@modules/games/domain/repositories/fakes/FakeActivitiesRepository';
import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import CompleteActivityService from './CompleteActivityService';
import { RequestError } from '@shared/infra/errors';
import { FakeCompleteActivityRequest } from '@modules/players/domain/entities/fakes';
import { FakeActivity, FakeGame } from '@shared/domain/entities/fakes';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { IPosition } from '@shared/domain/entities/ILeaderboard';
import { FakeLeaderboardsRepository } from '@shared/domain/repositories/fakes';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import FakeCompleteActivityRequestRepository from '@modules/players/domain/repositories/fakes/FakeCompleteActivityRequestRepository';
import CreateCompleteActivityRequestAdapter from '@modules/players/domain/adapters/CreateCompleteActivityRequest';
import FakeFeedPostsRepository from '@modules/players/domain/repositories/fakes/FakeFeedPostsRepository';

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
  fakeGame.levelInfo.push(
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
  );
  fakeGame.ranks.push(
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
  );

  const game = await gamesRepository.create(
    new CreateGameAdapter({
      name: fakeGame.name,
      description: fakeGame.description,
      creatorId: userId,
    }),
  );

  const player = await playersRepository.create(
    new CreatePlayerAdapter({
      userId,
      gameId: game.id,
      gameRanks: game.ranks,
      gameLevels: game.levelInfo,
    }),
  );

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

    const fakeActivity = new FakeActivity({ game: game.id });
    const activity = await activitiesRepository.create(
      new CreateActivityAdapter({
        gameId: game.id,
        name: fakeActivity.name,
        experience: 200,
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
      userId,
      gameId: game.id,
    });

    expect(updatedPlayer?.experience).toBe(activity.experience);

    const leaderboard = await leaderboardsRepository.getGameCurrentRanking(
      game.id,
    );

    expect(leaderboard?.position).toHaveLength(1);
    expect(leaderboard?.position).toContainEqual<IPosition>({
      experience: activity.experience,
      player: player,
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

    expect(updatedPlayer?.experience).toBe(activity.experience * 2);
    expect(updatedPlayer?.level).toBe(game.levelInfo[0].level);
    expect(updatedPlayer?.rank).toEqual(game.ranks[0]);

    const leaderboard = await leaderboardsRepository.getGameCurrentRanking(
      game.id,
    );

    expect(leaderboard?.position).toHaveLength(1);
    expect(leaderboard?.position).toContainEqual<IPosition>({
      experience: activity.experience * 2,
      player: player,
    });
  });

  it('should throw when trying to complete a non existing request', async () => {
    const { completeActivity, userId } = await initService();

    await expect(
      completeActivity.execute({ requestId: 'non-existing', userId }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
