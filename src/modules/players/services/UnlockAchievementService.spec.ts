import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/repositories/fakes/FakeAchievementsRepository';
import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import FakeFeedPostsRepository from '../repositories/fakes/FakeFeedPostsRepository';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import UnlockAchievementService from './UnlockAchievementService';
import { FakeAchievement, FakeGame } from '@modules/games/fakes';
import { IAchievement, IGame, ITitle } from '@modules/games/entities';
import FakePlayer from '../fakes/FakePlayer';
import { IPlayer, IUnlockAchievementRequest } from '../entities';
import FakeUnlockAchievementRequest from '../fakes/FakeUnlockAchievementRequest';
import { RequestError } from '@shared/errors/implementations';
import FakeTransactionProvider from '@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider';

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

  const userId = uuid();

  const { id: _, ...fakeGame } = new FakeGame();
  const game = await gamesRepository.create(fakeGame as IGame);

  const { id: __, ...fakeAchievement } = new FakeAchievement(game.id, title);
  const achievement = await achievementsRepository.create(
    fakeAchievement as IAchievement,
  );

  const { id: ___, ...fakePlayer } = new FakePlayer(userId, game.id);
  const player = await playersRepository.create(fakePlayer as IPlayer);

  const { id: ____, ...fakeRequest } = new FakeUnlockAchievementRequest(
    game.id,
    player.id,
    achievement.id,
  );
  const request = await unlockAchievementRequestRepository.create(
    fakeRequest as IUnlockAchievementRequest,
  );

  return {
    userId,
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

    const updatedPlayer = (await playersRepository.findOne(
      player.id,
      userId,
      game.id,
    )) as IPlayer;

    expect(updatedPlayer.achievements).toContain(achievement.id);

    const deletedRequest = await unlockAchievementRequestRepository.findOne(
      request.id,
    );

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
