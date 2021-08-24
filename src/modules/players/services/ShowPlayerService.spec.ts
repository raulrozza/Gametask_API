import { v4 as uuid } from 'uuid';

import { IPlayer } from '@modules/players/domain/entities';
import FakePlayer from '../fakes/FakePlayer';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import ShowPlayerService from './ShowPlayerService';

describe('ShowPlayerService', () => {
  it('should return the players information', async () => {
    const playersRepository = new FakePlayersRepository();
    const showPlayer = new ShowPlayerService(playersRepository);

    const userId = uuid();
    const gameId = uuid();
    const fakePlayer = new FakePlayer(userId, gameId);
    const createdPlayer = await playersRepository.create(fakePlayer as IPlayer);

    const player = await showPlayer.execute({
      id: createdPlayer.id,
      userId,
      gameId,
    });

    expect(player).toBe(createdPlayer);
  });

  it('should return undefined when the players information is wrong', async () => {
    const playersRepository = new FakePlayersRepository();
    const showPlayer = new ShowPlayerService(playersRepository);

    const player = await showPlayer.execute({
      id: 'wrong',
      userId: 'wrong',
      gameId: 'wrong',
    });

    expect(player).toBeUndefined();
  });
});
