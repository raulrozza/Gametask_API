import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import FakeFeedPostsRepository from '../repositories/fakes/FakeFeedPostsRepository';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import UnlockAchievementService from './UnlockAchievementService';
import { IUnlockAchievementRequest } from '../entities';
import { IPlayer } from '@modules/players/domain/entities';
import FakeUnlockAchievementRequest from '../fakes/FakeUnlockAchievementRequest';
import { RequestError } from '@shared/infra/errors';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import { ITitle } from '@shared/domain/entities';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { FakeAchievement, FakeGame } from '@shared/domain/entities/fakes';
import { FakePlayer } from '@modules/players/domain/entities/fakes';

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

  const fakeGame = new FakeGame();
  const createGame = new CreateGameAdapter({
    name: fakeGame.name,
    description: fakeGame.description,
    creatorId: userId,
  });
  const game = await gamesRepository.create(createGame);

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

  const { id: ___, ...fakePlayer } = new FakePlayer({
    user: userId,
    game: game.id,
  });
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
