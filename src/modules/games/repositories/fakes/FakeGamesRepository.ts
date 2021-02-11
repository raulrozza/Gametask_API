import { v4 as uuid } from 'uuid';
import { IGame } from '@modules/games/entities';
import { IGamesRepository } from '..';

export default class FakeGamesRepository implements IGamesRepository {
  private readonly games: IGame[] = [];

  public async findAllFromUser(userId: string): Promise<IGame[]> {
    return Promise.resolve(
      this.games.filter(game =>
        (game.administrators as string[]).includes(userId),
      ),
    );
  }

  public async findOne(
    id: string,
    userId?: string,
  ): Promise<IGame | undefined> {
    if (userId)
      return this.games.find(
        game =>
          game.id === id && (game.administrators as string[]).includes(userId),
      );

    return this.games.find(game => game.id === id);
  }

  public async create(game: IGame): Promise<IGame> {
    game.id = uuid();

    this.games.push(game);

    return Promise.resolve(game);
  }

  public async update({ id, ...game }: IGame): Promise<IGame> {
    const foundIndex = this.games.findIndex(storedGame => storedGame.id === id);

    const foundGame = this.games[foundIndex];

    const updatedGame = {
      ...foundGame,
      ...game,
    };

    this.games[foundIndex] = updatedGame;

    return updatedGame;
  }
}
