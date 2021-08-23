import { IUser } from '@modules/users/domain/entities';
import FakeUser from '@modules/users/domain/entities/fakes/FakeUser';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import { FakeGame } from '@modules/games/fakes';
import { IGame, IRank } from '@modules/games/entities';
import FakeGamesRepository from '@modules/games/domain/repositories/fakes/FakeGamesRepository';
import { CreatePlayerService } from '.';
import FakePlayersRepository from '../repositories/fakes/FakePlayersRepository';
import { RequestError } from '@shared/infra/errors';

const initService = async (addRanks: boolean | IRank[] = false) => {
  const playersRepository = new FakePlayersRepository();
  const usersRepository = new FakeUsersRepository();
  const gamesRepository = new FakeGamesRepository();

  const createPlayers = new CreatePlayerService(
    playersRepository,
    gamesRepository,
    usersRepository,
  );

  const { id: _, ...fakeUser } = new FakeUser();
  const user = await usersRepository.create(fakeUser as IUser);
  const { id: __, ...fakeGame } = new FakeGame();
  if (addRanks) {
    fakeGame.levelInfo = [
      {
        level: 1,
        requiredExperience: 300,
      },
      {
        level: 2,
        requiredExperience: 500,
      },
    ];

    fakeGame.ranks =
      typeof addRanks === 'boolean'
        ? [
            {
              color: '#000',
              level: 1,
              name: 'Rank1',
              tag: 'RNK',
            },
            {
              color: '#000',
              level: 2,
              name: 'Rank2',
              tag: 'RNK',
            },
          ]
        : addRanks;
  }
  const game = await gamesRepository.create(fakeGame as IGame);

  return { createPlayers, gameId: game.id, userId: user.id };
};

describe('CreatePlayerService', () => {
  it('should create the player successfully', async () => {
    const { createPlayers, gameId, userId } = await initService();

    const player = await createPlayers.execute({ userId, gameId });

    expect(player.game).toBe(gameId);
    expect(player.user).toBe(userId);
    expect(player.level).toBe(0);
  });

  it('should create the player successfully and assign the initialRank to it', async () => {
    const { createPlayers, gameId, userId } = await initService([
      {
        color: '#000',
        level: 2,
        name: 'Rank2',
        tag: 'RNK',
      },
    ]);

    const player = await createPlayers.execute({ userId, gameId });

    expect(player.level).toBe(1);
  });

  it('should throw when creating a player with a unexisting user', async () => {
    const { createPlayers, gameId } = await initService();

    await expect(
      createPlayers.execute({ userId: 'fake-user', gameId }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when creating a player on a unexisting game', async () => {
    const { createPlayers, userId } = await initService();

    await expect(
      createPlayers.execute({ gameId: 'fake-game', userId }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should throw when trying to create a player when a player already exists matching user and game', async () => {
    const { createPlayers, gameId, userId } = await initService(true);

    await createPlayers.execute({ userId, gameId });

    await expect(
      createPlayers.execute({ userId, gameId }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
