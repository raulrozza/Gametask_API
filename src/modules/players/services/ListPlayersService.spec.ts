import { v4 as uuid } from 'uuid';

import FakePlayersRepository from '@modules/players/domain/repositories/fakes/FakePlayersRepository';
import ListPlayersService from './ListPlayersService';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import { FakeGame } from '@shared/domain/entities/fakes';

describe('ListPlayersService', () => {
  it('should list all games from the user', async () => {
    const playersRepository = new FakePlayersRepository();
    const listPlayers = new ListPlayersService(playersRepository);

    const userId = uuid();
    const game = new FakeGame();

    await playersRepository.create(
      new CreatePlayerAdapter({
        userId,
        gameId: uuid(),
        gameRanks: game.ranks,
        gameLevels: game.levelInfo,
      }),
    );
    await playersRepository.create(
      new CreatePlayerAdapter({
        userId: uuid(),
        gameId: uuid(),
        gameRanks: game.ranks,
        gameLevels: game.levelInfo,
      }),
    );
    await playersRepository.create(
      new CreatePlayerAdapter({
        userId,
        gameId: uuid(),
        gameRanks: game.ranks,
        gameLevels: game.levelInfo,
      }),
    );

    const players = await listPlayers.execute(userId);

    expect(players).toHaveLength(2);
  });
});
