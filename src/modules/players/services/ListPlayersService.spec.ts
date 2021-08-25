import { v4 as uuid } from 'uuid';

import { IPlayer } from '@modules/players/domain/entities';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import ListPlayersService from './ListPlayersService';
import { FakePlayer } from '@modules/players/domain/entities/fakes';

describe('ListPlayersService', () => {
  it('should list all games from the user', async () => {
    const playersRepository = new FakePlayersRepository();
    const listPlayers = new ListPlayersService(playersRepository);

    const userId = uuid();
    const player = new FakePlayer({ user: userId });

    await playersRepository.create({ ...player, game: 'game-01' } as IPlayer);
    await playersRepository.create({
      ...player,
      game: 'game-02',
      user: 'user-id',
    } as IPlayer);
    await playersRepository.create({ ...player, game: 'game-03' } as IPlayer);

    const players = await listPlayers.execute(userId);

    expect(players).toHaveLength(2);
  });
});
