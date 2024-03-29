import {
  FakeAchievementsRepository,
  FakeGamesRepository,
} from '@shared/domain/repositories/fakes';

import FakeFeedPostsRepository from '@modules/players/domain/repositories/fakes/FakeFeedPostsRepository';
import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import FakeUnlockAchievementRequestRepository from '@modules/players/domain/repositories/fakes/FakeUnlockAchievementRequestRepository';
import UnlockAchievementService from './UnlockAchievementService';
import { IPlayer } from '@modules/players/domain/entities';
import { RequestError } from '@shared/infra/errors';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import { ITitle } from '@shared/domain/entities';
import CreateGameAdapter from '@shared/domain/adapters/CreateGame';
import {
  FakeAchievement,
  FakeGame,
  FakeUser,
} from '@shared/domain/entities/fakes';
import { FakeUnlockAchievementRequest } from '@modules/players/domain/entities/fakes';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import CreateUnlockAchievementAdapter from '@modules/players/domain/adapters/CreateUnlockAchievement';

const initService = async (title?: ITitle) => {
  const playersRepository = new FakePlayersRepository();
  const achievementsRepository = new FakeAchievementsRepository();
  const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
  const gamesRepository = new FakeGamesRepository();
  const feedPostsRepository = new FakeFeedPostsRepository();
  const transactionProvider = new FakeTransactionProvider();

  const unlockAchievement = new UnlockAchievementService(
    playersRepository,
    achievementsRepository,
    unlockAchievementRequestRepository,
    gamesRepository,
    feedPostsRepository,
    transactionProvider,
  );

  const user = new FakeUser();

  const fakeGame = new FakeGame();
  const game = await gamesRepository.create(
    new CreateGameAdapter({
      name: fakeGame.name,
      description: fakeGame.description,
      creatorId: user.id,
    }),
  );

  const fakeAchievement = new FakeAchievement({
    game: game.id,
    title,
  });
  const achievement = await achievementsRepository.create({
    name: fakeAchievement.name,
    description: fakeAchievement.description,
    title: fakeAchievement.title?.id,
    gameId: fakeAchievement.game.id,
  });

  const player = await playersRepository.create(
    new CreatePlayerAdapter({
      gameId: game.id,
      userId: user.id,
      gameLevels: game.levelInfo,
      gameRanks: game.ranks,
    }),
  );

  const fakeRequest = new FakeUnlockAchievementRequest({
    game: game.id,
    requester: player.id,
    achievement: achievement.id,
  });
  const request = await unlockAchievementRequestRepository.create(
    new CreateUnlockAchievementAdapter({
      ...fakeRequest,
      requester: fakeRequest.requester.id,
      achievement: fakeRequest.achievement.id,
    }),
  );

  return {
    userId: user.id,
    unlockAchievement,
    game,
    achievement,
    player,
    request,
    playersRepository,
    unlockAchievementRequestRepository,
  };
};

describe('UnlockAchievementService', () => {
  it('should unlock the achievement for the player, removing the unlock request', async () => {
    const {
      unlockAchievement,
      userId,
      game,
      achievement,
      player,
      request,
      playersRepository,
      unlockAchievementRequestRepository,
    } = await initService();

    await unlockAchievement.execute({
      achievementId: achievement.id,
      gameId: game.id,
      playerId: player.id,
      requestId: request.id,
      userId: userId,
    });

    const updatedPlayer = (await playersRepository.findOne({
      id: player.id,
      userId,
      gameId: game.id,
    })) as IPlayer;

    const achievementsIds = updatedPlayer.achievements.map(
      achievement => achievement.id,
    );
    expect(achievementsIds).toContain(achievement.id);

    const deletedRequest = await unlockAchievementRequestRepository.findOne({
      id: request.id,
    });

    expect(deletedRequest).toBeUndefined();
  });

  it('should throw when trying to unlock an unexisting achievement', async () => {
    const {
      unlockAchievement,
      game,
      userId,
      player,
      request,
    } = await initService();

    await expect(
      unlockAchievement.execute({
        achievementId: 'wrong-achievement',
        gameId: game.id,
        playerId: player.id,
        requestId: request.id,
        userId: userId,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to unlock an achievement for a non existing player', async () => {
    const {
      unlockAchievement,
      userId,
      game,
      achievement,
      request,
    } = await initService();

    await expect(
      unlockAchievement.execute({
        achievementId: achievement.id,
        gameId: game.id,
        playerId: 'wrong player',
        requestId: request.id,
        userId: userId,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to unlock an achievement that hasnt been requested', async () => {
    const {
      unlockAchievement,
      userId,
      game,
      achievement,
      player,
    } = await initService();

    await expect(
      unlockAchievement.execute({
        achievementId: achievement.id,
        gameId: game.id,
        playerId: player.id,
        requestId: 'wrong-request',
        userId: userId,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
