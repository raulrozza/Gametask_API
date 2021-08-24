import { v4 as uuid } from 'uuid';

import FakeTitlesRepository from '@modules/games/domain/repositories/fakes/FakeTitlesRepository';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import ChangeTitleService from './ChangeTitleService';
import FakePlayer from '../fakes/FakePlayer';
import { IPlayer } from '@modules/players/domain/entities';
import { RequestError } from '@shared/infra/errors';
import { ITitle } from '@shared/domain/entities';
import { FakeTitle, FakeUser } from '@shared/domain/entities/fakes';

const initService = async () => {
  const titlesRepository = new FakeTitlesRepository();
  const playersRepository = new FakePlayersRepository();
  const changeTitle = new ChangeTitleService(
    playersRepository,
    titlesRepository,
  );

  const userId = uuid();
  const gameId = uuid();
  const { id: _, ...fakeTitle } = new FakeTitle({ game: gameId });
  const user = new FakeUser({ id: userId });
  const { id: __, ...fakePlayer } = new FakePlayer(user, gameId);

  const title = await titlesRepository.create(fakeTitle as ITitle);
  const player = await playersRepository.create(fakePlayer as IPlayer);

  return {
    changeTitle,
    title,
    player,
    gameId,
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
