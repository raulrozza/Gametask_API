import { v4 as uuid } from 'uuid';

import FakeTitlesRepository from '@modules/games/domain/repositories/fakes/FakeTitlesRepository';
import ChangeTitleService from './ChangeTitleService';
import { RequestError } from '@shared/infra/errors';
import { FakeGame, FakeTitle } from '@shared/domain/entities/fakes';
import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';

const initService = async () => {
  const titlesRepository = new FakeTitlesRepository();
  const playersRepository = new FakePlayersRepository();
  const changeTitle = new ChangeTitleService(
    playersRepository,
    titlesRepository,
  );

  const userId = uuid();
  const game = new FakeGame();
  const fakeTitle = new FakeTitle({ game: game.id });

  const title = await titlesRepository.create(fakeTitle);
  const player = await playersRepository.create(
    new CreatePlayerAdapter({
      userId,
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
    userId,
  };
};

describe('ChangeTitleService', () => {
  it('should successfully change the title to a new one', async () => {
    const { changeTitle, gameId, userId, title, player } = await initService();

    const updatedPlayer = await changeTitle.execute({
      gameId,
      userId,
      playerId: player.id,
      titleId: title.id,
    });

    expect(updatedPlayer.currentTitle).toBe(title.id);
  });

  it('should remove the current title when sending an empty titleId', async () => {
    const { changeTitle, gameId, userId, title, player } = await initService();

    await changeTitle.execute({
      gameId,
      userId,
      playerId: player.id,
      titleId: title.id,
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
