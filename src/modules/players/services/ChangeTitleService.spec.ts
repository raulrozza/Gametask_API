import { FakeTitlesRepository } from '@shared/domain/repositories/fakes';
import ChangeTitleService from './ChangeTitleService';
import { RequestError } from '@shared/infra/errors';
import {
  FakeAchievement,
  FakeGame,
  FakeTitle,
  FakeUser,
} from '@shared/domain/entities/fakes';
import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
const initService = async () => {
  const titlesRepository = new FakeTitlesRepository();
  const playersRepository = new FakePlayersRepository();
  const changeTitle = new ChangeTitleService(
    playersRepository,
    titlesRepository,
  );

  const user = new FakeUser();
  const game = new FakeGame();
  const fakeTitle = new FakeTitle({ game: game.id });

  const title = await titlesRepository.create(fakeTitle);
  const player = await playersRepository.create(
    new CreatePlayerAdapter({
      userId: user.id,
      gameId: game.id,
      gameLevels: game.levelInfo,
      gameRanks: game.ranks,
    }),
  );

  return {
    changeTitle,
    title,
    player,
    gameId: game.id,
    userId: user.id,
    playersRepository,
  };
};

describe('ChangeTitleService', () => {
  it('should successfully change the title to a new one', async () => {
    const {
      changeTitle,
      gameId,
      userId,
      title,
      player,
      playersRepository,
    } = await initService();

    const achievement = new FakeAchievement();
    await playersRepository.addAchievement({
      id: player.id,
      achievement: achievement.id,
      title: title.id,
    });

    const updatedPlayer = await changeTitle.execute({
      gameId,
      userId,
      playerId: player.id,
      titleId: title.id,
    });

    expect(updatedPlayer.currentTitle?.id).toBe(title.id);
  });

  it('should remove the current title when sending an empty titleId', async () => {
    const {
      changeTitle,
      gameId,
      userId,
      title,
      player,
      playersRepository,
    } = await initService();

    const achievement = new FakeAchievement();
    await playersRepository.addAchievement({
      id: player.id,
      achievement: achievement.id,
      title: title.id,
    });

    await changeTitle.execute({
      gameId,
      userId,
      playerId: player.id,
      titleId: undefined,
    });

    const updatedPlayer = await changeTitle.execute({
      gameId,
      userId,
      playerId: player.id,
    });

    expect(updatedPlayer.currentTitle).toBeUndefined();
  });

  it('should throw when sending an invalid title id', async () => {
    const { changeTitle, gameId, userId, player } = await initService();

    await expect(
      changeTitle.execute({
        gameId,
        userId,
        playerId: player.id,
        titleId: 'invalid id',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw changing a title you dont own', async () => {
    const { changeTitle, gameId, userId, player, title } = await initService();

    await expect(
      changeTitle.execute({
        gameId,
        userId,
        playerId: player.id,
        titleId: title.id,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when sending an invalid player id', async () => {
    const { changeTitle, gameId, userId, title } = await initService();

    await expect(
      changeTitle.execute({
        gameId,
        userId,
        playerId: 'invalid id',
        titleId: title.id,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
