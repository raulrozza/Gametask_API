import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import CreateUnlockAchievementRequestService from './CreateUnlockAchievementRequestService';
import { RequestError } from '@shared/infra/errors';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { FakeAchievement, FakeGame } from '@shared/domain/entities/fakes';
import { FakeUnlockAchievementRequest } from '@modules/players/domain/entities/fakes';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import AddAchievementToPlayerAdapter from '@modules/players/domain/adapters/AddAchievementToPlayer';

const initService = async () => {
  const unlockAchievementRequestRepository = new FakeUnlockAchievementRequestRepository();
  const gamesRepository = new FakeGamesRepository();
  const achievementsRepository = new FakeAchievementsRepository();
  const playersRepository = new FakePlayersRepository();
  const transactionProvider = new FakeTransactionProvider();

  const createUnlockAchievementRequest = new CreateUnlockAchievementRequestService(
    unlockAchievementRequestRepository,
    gamesRepository,
    achievementsRepository,
    playersRepository,
    transactionProvider,
  );

  const userId = uuid();

  const fakeGame = new FakeGame();
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
      gameLevels: game.levelInfo,
      gameRanks: game.ranks,
    }),
  );

  const fakeAchievement = new FakeAchievement({
    game: game.id,
  });
  const achievement = await achievementsRepository.create({
    name: fakeAchievement.name,
    description: fakeAchievement.description,
    title: fakeAchievement.title?.id,
    gameId: fakeAchievement.game.id,
  });

  return {
    userId,
    createUnlockAchievementRequest,
    game,
    player,
    achievement,
    playersRepository,
  };
};

describe('CreateUnlockAchievementRequestService', () => {
  it('should request to unlock the achievement correctly', async () => {
    const {
      userId,
      createUnlockAchievementRequest,
      game,
      player,
      achievement,
    } = await initService();

    const fakeRequest = new FakeUnlockAchievementRequest({
      game: game.id,
      requester: player.id,
      achievement: achievement.id,
    });

    const request = await createUnlockAchievementRequest.execute({
      userId,
      achievement: fakeRequest.achievement.id,
      gameId: fakeRequest.game,
      requestDate: fakeRequest.requestDate,
      requester: fakeRequest.requester.id,
      information: fakeRequest.information,
    });

    expect(request).toHaveProperty('id');
    expect(request.game).toBe(fakeRequest.game);
    expect(request.requester).toBe(fakeRequest.requester);
    expect(request.achievement).toBe(fakeRequest.achievement);
  });

  it('should not be able to request the unlock of the same achievement twice', async () => {
    const {
      userId,
      createUnlockAchievementRequest,
      game,
      player,
      achievement,
    } = await initService();

    const fakeRequest = new FakeUnlockAchievementRequest({
      game: game.id,
      requester: player.id,
      achievement: achievement.id,
    });

    await createUnlockAchievementRequest.execute({
      userId,
      achievement: fakeRequest.achievement.id,
      gameId: fakeRequest.game,
      requestDate: fakeRequest.requestDate,
      requester: fakeRequest.requester.id,
      information: fakeRequest.information,
    });

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement.id,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester.id,
        information: fakeRequest.information,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to request the unlock of an achievement the player already possesses', async () => {
    const {
      userId,
      createUnlockAchievementRequest,
      game,
      player,
      achievement,
      playersRepository,
    } = await initService();

    await playersRepository.addAchievement(
      new AddAchievementToPlayerAdapter({
        id: player.id,
        achievement: achievement.id,
      }),
    );

    const fakeRequest = new FakeUnlockAchievementRequest({
      game: game.id,
      requester: player.id,
      achievement: achievement.id,
    });

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement.id,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester.id,
        information: fakeRequest.information,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to request the unlock of an unexisting achievement', async () => {
    const {
      userId,
      createUnlockAchievementRequest,
      game,
      player,
    } = await initService();

    const fakeRequest = new FakeUnlockAchievementRequest({
      game: game.id,
      requester: player.id,
      achievement: 'invalid achievement id',
    });

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement.id,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester.id,
        information: fakeRequest.information,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be allow an unexisting player to make a request', async () => {
    const {
      userId,
      createUnlockAchievementRequest,
      game,
      achievement,
    } = await initService();

    const fakeRequest = new FakeUnlockAchievementRequest({
      game: game.id,
      requester: 'invalid player id',
      achievement: achievement.id,
    });

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement.id,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester.id,
        information: fakeRequest.information,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to make a request to a non existing game', async () => {
    const {
      userId,
      createUnlockAchievementRequest,
      player,
      achievement,
    } = await initService();

    const fakeRequest = new FakeUnlockAchievementRequest({
      game: 'invalid game id',
      requester: player.id,
      achievement: achievement.id,
    });

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement.id,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester.id,
        information: fakeRequest.information,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
