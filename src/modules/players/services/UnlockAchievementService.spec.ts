import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/repositories/fakes/FakeAchievementsRepository';
import FakeGamesRepository from '@modules/games/repositories/fakes/FakeGamesRepository';
import FakeFeedPostsRepository from '../repositories/fakes/FakeFeedPostsRepository';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import UnlockAchievementService from './UnlockAchievementService';
import { FakeAchievement } from '@modules/games/fakes';
import { IAchievement } from '@modules/games/entities';
import FakePlayer from '../fakes/FakePlayer';
import { IPlayer, IUnlockAchievementRequest } from '../entities';
import FakeUnlockAchievementRequest from '../fakes/FakeUnlockAchievementRequest';
import { RequestError } from '@shared/errors/implementations';
import FakeTransactionProvider from '@shared/container/providers/TransactionProvider/fakes/FakeTransactionProvider';

const initService = async () => {
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

  const generalId = uuid();

  const { id: _, ...fakeAchievement } = new FakeAchievement(generalId);
  const achievement = await achievementsRepository.create(
    fakeAchievement as IAchievement,
  );

  const { id: __, ...fakePlayer } = new FakePlayer(generalId, generalId);
  const player = await playersRepository.create(fakePlayer as IPlayer);

  const { id: ___, ...fakeRequest } = new FakeUnlockAchievementRequest(
    generalId,
    player.id,
    achievement.id,
  );
  const request = await unlockAchievementRequestRepository.create(
    fakeRequest as IUnlockAchievementRequest,
  );

  return {
    generalId,
    unlockAchievement,
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
      generalId,
      achievement,
      player,
      request,
      playersRepository,
      unlockAchievementRequestRepository,
    } = await initService();

    await unlockAchievement.execute({
      achievementId: achievement.id,
      gameId: generalId,
      playerId: player.id,
      requestId: request.id,
      userId: generalId,
    });

    const updatedPlayer = (await playersRepository.findOne(
      player.id,
      generalId,
      generalId,
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
      generalId,
      player,
      request,
    } = await initService();

    await expect(
      unlockAchievement.execute({
        achievementId: 'wrong-achievement',
        gameId: generalId,
        playerId: player.id,
        requestId: request.id,
        userId: generalId,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to unlock an achievement for a non existing player', async () => {
    const {
      unlockAchievement,
      generalId,
      achievement,
      request,
    } = await initService();

    await expect(
      unlockAchievement.execute({
        achievementId: achievement.id,
        gameId: generalId,
        playerId: 'wrong player',
        requestId: request.id,
        userId: generalId,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to unlock an achievement that hasnt been requested', async () => {
    const {
      unlockAchievement,
      generalId,
      achievement,
      player,
    } = await initService();

    await expect(
      unlockAchievement.execute({
        achievementId: achievement.id,
        gameId: generalId,
        playerId: player.id,
        requestId: 'wrong-request',
        userId: generalId,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
