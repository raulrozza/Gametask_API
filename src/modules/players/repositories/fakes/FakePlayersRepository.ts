import { v4 as uuid } from 'uuid';

import { IPlayersRepository } from '@modules/players/repositories';
import { IPlayer } from '@modules/players/domain/entities';

export default class FakePlayersRepository implements IPlayersRepository {
  private readonly players: IPlayer[] = [];

  public async findAllFromUser(userId: string): Promise<IPlayer[]> {
    return Promise.resolve(
      this.players.filter(player =>
        typeof player.user === 'string'
          ? player.user === userId
          : player.user.id === userId,
      ),
    );
  }

  public async findOne(
    id: string,
    userId: string,
    gameId: string,
  ): Promise<IPlayer | undefined> {
    const foundPlayer = this.players.find(
      player =>
        player.id === id &&
        (typeof player.user === 'string'
          ? player.user === userId
          : player.user.id === userId) &&
        (typeof player.game === 'string'
          ? player.game === gameId
          : player.game.id === gameId),
    );

    return Promise.resolve(foundPlayer);
  }

  public async findById(id: string): Promise<IPlayer | undefined> {
    return this.players.find(player => player.id === id);
  }

  public async create(player: IPlayer): Promise<IPlayer> {
    player.id = uuid();

    this.players.push(player);

    return Promise.resolve(player);
  }

  public async isThereAPlayerAssociatedWith(
    userId: string,
    gameId: string,
  ): Promise<boolean> {
    const player = this.players.find(
      player =>
        (typeof player.user === 'string'
          ? player.user === userId
          : player.user.id === userId) &&
        (typeof player.game === 'string'
          ? player.game === gameId
          : player.game.id === gameId),
    );

    return Boolean(player);
  }

  public async update({ id, ...player }: IPlayer): Promise<IPlayer> {
    const foundIndex = this.players.findIndex(
      storedPlayer => storedPlayer.id === id,
    );

    const foundPlayer = this.players[foundIndex];

    const updatedPlayer = {
      ...foundPlayer,
      ...player,
    };

    this.players[foundIndex] = updatedPlayer;

    return updatedPlayer;
  }

  public async unlockAchievement(
    id: string,
    achievement: string,
    title?: string,
  ): Promise<IPlayer> {
    const foundIndex = this.players.findIndex(
      storedPlayer => storedPlayer.id === id,
    );

    const foundPlayer = this.players[foundIndex];
    (foundPlayer.achievements as string[]).push(achievement);
    if (title) (foundPlayer.titles as string[]).push(title);

    this.players[foundIndex] = foundPlayer;

    return foundPlayer;
  }
}
