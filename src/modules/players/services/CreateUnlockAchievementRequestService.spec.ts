import { v4 as uuid } from 'uuid';

import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import FakeUnlockAchievementRequestRepository from '../repositories/fakes/FakeUnlockAchievementRequestRepository';
import CreateUnlockAchievementRequestService from './CreateUnlockAchievementRequestService';
import { IPlayer } from '@modules/players/domain/entities';
import FakeUnlockAchievementRequest from '../fakes/FakeUnlockAchievementRequest';
import { RequestError } from '@shared/infra/errors';
import FakeTransactionProvider from '@shared/domain/providers/fakes/FakeTransactionProvider';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import {
  FakeAchievement,
  FakeGame,
  FakeUser,
} from '@shared/domain/entities/fakes';
import { FakePlayer } from '@modules/players/domain/entities/fakes';

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
  const createGame = new CreateGameAdapter({
    name: fakeGame.name,
    description: fakeGame.description,
    creatorId: userId,
  });
  const game = await gamesRepository.create(createGame);

  const fakeUser = new FakeUser({ id: userId });
  const { id: __, ...fakePlayer } = new FakePlayer({
    user: fakeUser,
    game: game.id,
  });
  const player = await playersRepository.create(fakePlayer as IPlayer);

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

    const fakeRequest = new FakeUnlockAchievementRequest(
      game.id,
      player.id,
      achievement.id,
    );

    const request = await createUnlockAchievementRequest.execute({
      userId,
      achievement: fakeRequest.achievement,
      gameId: fakeRequest.game,
      requestDate: fakeRequest.requestDate,
      requester: fakeRequest.requester,
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

    const fakeRequest = new FakeUnlockAchievementRequest(
      game.id,
      player.id,
      achievement.id,
    );

    await createUnlockAchievementRequest.execute({
      userId,
      achievement: fakeRequest.achievement,
      gameId: fakeRequest.game,
      requestDate: fakeRequest.requestDate,
      requester: fakeRequest.requester,
      information: fakeRequest.information,
    });

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester,
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

    player.achievements.push(
      new FakeAchievement({ id: achievement.id, game: game.id }),
    );
    await playersRepository.update(player);

    const fakeRequest = new FakeUnlockAchievementRequest(
      game.id,
      player.id,
      achievement.id,
    );

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester,
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

    const fakeRequest = new FakeUnlockAchievementRequest(
      game.id,
      player.id,
      'invalid achievement id',
    );

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester,
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

    const fakeRequest = new FakeUnlockAchievementRequest(
      game.id,
      'invalid player id',
      achievement.id,
    );

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester,
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

    const fakeRequest = new FakeUnlockAchievementRequest(
      'invalid game id',
      player.id,
      achievement.id,
    );

    await expect(
      createUnlockAchievementRequest.execute({
        userId,
        achievement: fakeRequest.achievement,
        gameId: fakeRequest.game,
        requestDate: fakeRequest.requestDate,
        requester: fakeRequest.requester,
        information: fakeRequest.information,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
