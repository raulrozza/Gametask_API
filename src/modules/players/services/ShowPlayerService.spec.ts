import { v4 as uuid } from 'uuid';

import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import ShowPlayerService from './ShowPlayerService';
import { FakeGame } from '@shared/domain/entities/fakes';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';

describe('ShowPlayerService', () => {
  it('should return the players information', async () => {
    const playersRepository = new FakePlayersRepository();
    const showPlayer = new ShowPlayerService(playersRepository);

    const userId = uuid();
    const game = new FakeGame();
    const createdPlayer = await playersRepository.create(
      new CreatePlayerAdapter({
        userId,
        gameId: game.id,
        gameRanks: game.ranks,
        gameLevels: game.levelInfo,
      }),
    );

    const player = await showPlayer.execute({
      id: createdPlayer.id,
      userId,
      gameId: game.id,
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
